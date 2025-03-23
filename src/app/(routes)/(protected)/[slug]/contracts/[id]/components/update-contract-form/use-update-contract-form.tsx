import { ContractInvoicePDF } from "@/components/contract-pdf/invoice/contract-invoice-pdf";
import type { BadgeProps } from "@/components/ui/badge";
import type { ContractProps } from "@/http/contracts/types";
import { useUpdateContractService } from "@/http/contracts/use-contracts-service";
import { useGetCustomerByIdService } from "@/http/customers/use-customers-service";
import { useGetItemsAvailabilityService } from "@/http/items/use-items-service";
import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContractDocumentType,
  ContractStatus,
  PaymentMethod,
} from "@prisma/client";
import { pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const paymentMethodSchema = z.object({
  id: z.string().optional(),
  method: z.nativeEnum(PaymentMethod),
  value: z.number().min(0, "Valor deve ser maior que zero"),
  creditParcelAmount: z
    .number()
    .min(1, "Número de parcelas deve ser pelo menos 1"),
  paymentDate: z.string(),
  isPaid: z.boolean(),
});

const rentedItemSchema = z.object({
  id: z.string().optional(),
  itemId: z.string(),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1"),
  isBonus: z.boolean().default(false),
  discount: z.number().default(0),
  finalValue: z.number(),
  discountMode: z.enum(["currency", "percent"]).optional(),
});

const updateContractFormSchema = z.object({
  eventDate: z.string(),
  withdrawalDate: z.string(),
  returnDate: z.string(),
  additionalInformation: z.string().optional(),
  paymentMethod: z.array(paymentMethodSchema),
  items: z.array(rentedItemSchema),
  totalValue: z.number().optional(),
});

type UpdateContractFormValues = z.infer<typeof updateContractFormSchema>;

type UseUpdateContractFormProps = {
  contract: ContractProps;
};

const formatDate = (date: Date | string) => {
  try {
    const validDate = date instanceof Date ? date : new Date(date);
    if (isNaN(validDate.getTime())) {
      return format(new Date(), "yyyy-MM-dd");
    }
    return format(validDate, "yyyy-MM-dd");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return format(new Date(), "yyyy-MM-dd");
  }
};

export default function useUpdateContractForm({
  contract,
}: UseUpdateContractFormProps) {
  const router = useRouter();
  const { id, slug } = useParams() as { id: string; slug: string };
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [paymentToRemove, setPaymentToRemove] = useState<number | null>(null);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [isUpdatingPdf, setIsUpdatingPdf] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const form = useForm<UpdateContractFormValues>({
    resolver: zodResolver(updateContractFormSchema),
    defaultValues: {
      eventDate: formatDate(contract?.eventDate || new Date()),
      withdrawalDate: formatDate(contract?.withdrawalDate || new Date()),
      returnDate: formatDate(contract?.returnDate || new Date()),
      additionalInformation: contract?.additionalInformation || "",
      totalValue: contract?.totalValue || 0,
      paymentMethod:
        Array.isArray(contract?.payments) && contract.payments.length > 0
          ? contract.payments.map((payment) => ({
              id: payment.id,
              method: payment.method,
              value: payment.value,
              creditParcelAmount: payment.creditParcelAmount,
              paymentDate: formatDate(payment.paymentDate),
              isPaid: payment.isPaid,
            }))
          : [
              {
                method: PaymentMethod.CASH,
                value: 0,
                creditParcelAmount: 1,
                paymentDate: formatDate(new Date()),
                isPaid: false,
              },
            ],

      items:
        Array.isArray(contract?.rentedItems) && contract.rentedItems.length > 0
          ? contract.rentedItems.map((item) => ({
              id: item.id,
              itemId: item.itemId,
              quantity: item.quantity,
              isBonus: item.isBonus || false,
              discount: item.discount || 0,
              finalValue: item.finalValue,
            }))
          : [],
    },
  });

  const { data: organization } = useGetOrganizationService({ slug });

  const { mutateAsync: updateContractService, isPending: isUpdatingContract } =
    useUpdateContractService();

  const { data: availabilityData } = useGetItemsAvailabilityService(
    {
      slug,
      eventDate: form.watch("eventDate"),
      withdrawalDate: form.watch("withdrawalDate"),
      returnDate: form.watch("returnDate"),
    },
    {
      enabled:
        !!form.watch("eventDate") &&
        !!form.watch("withdrawalDate") &&
        !!form.watch("returnDate") &&
        isOpenDialog,
      queryKey: [
        "getItemsAvailability",
        slug,
        form.watch("eventDate"),
        form.watch("withdrawalDate"),
        form.watch("returnDate"),
      ],
    }
  );

  const { data: customerProps } = useGetCustomerByIdService({
    customerId: contract.customer.id,
    slug,
  });

  async function generateContractPDF() {
    const formValues = form.getValues();
    const formItems = formValues.items || [];

    const selectedItemsData = formItems
      .map((formItem) => {
        // Primeiro, verificar se o item existe nos itens disponíveis
        const itemData = availableItems?.find(
          (item) => item.id === formItem.itemId
        );

        // Se não encontrar nos itens disponíveis, procurar nos itens originais do contrato
        const originalItem = contract.rentedItems?.find(
          (item) => item.itemId === formItem.itemId
        );

        // Se não encontrar em nenhum lugar, retornar null
        if (!itemData && !originalItem) return null;

        // Usar os dados do item disponível ou do item original do contrato
        const baseItemData = itemData || {
          id: formItem.itemId,
          name: originalItem?.item?.name || "Item não encontrado",
          price: originalItem?.item?.price || 0,
        };

        // Adaptar o formato do desconto para o esperado pelo ContractPDF
        const discount = formItem.discountMode
          ? {
              value: formItem.discount || 0,
              mode: formItem.discountMode as "currency" | "percent",
            }
          : formItem.discount || 0;

        return {
          ...baseItemData,
          quantity: formItem.quantity,
          isBonus: formItem.isBonus,
          discount: discount,
          discountMode: formItem.discountMode,
          finalValue: formItem.finalValue,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const seller = {
      name: contract.seller.name || "",
    };

    // Gerar o PDF
    const blob = await pdf(
      <ContractInvoicePDF
        organization={organization}
        customer={customerProps}
        items={selectedItemsData}
        totalValue={contract.totalValue}
        seller={seller}
        formValues={formValues}
        code={contract.code}
      />
    ).toBlob();

    return blob;
  }

  async function getContractPdfAndUpdateContract() {
    setIsUpdatingPdf(true);
    try {
      const supabase = createClient();
      const pdfBlob = await generateContractPDF();

      const fileNamePath = `${slug}/${ContractDocumentType.INVOICE.toLowerCase()}/contrato-${
        contract.code
      }-${ContractDocumentType.INVOICE.toLowerCase()}.pdf`;

      const { error: supabaseError } = await supabase.storage
        .from("organization-contracts")
        .upload(fileNamePath, pdfBlob, {
          upsert: true,
          contentType: "application/pdf",
          cacheControl: "1",
        });

      if (supabaseError) {
        console.error("Error uploading contract PDF", supabaseError);
        toast.warning(
          "Não foi possível fazer upload do contrato, tente novamente."
        );
        return null;
      }

      const { data } = await supabase.storage
        .from("organization-contracts")
        .getPublicUrl(fileNamePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error generating or uploading PDF", error);
      toast.error("Erro ao gerar ou fazer upload do PDF do contrato");
      return null;
    } finally {
      setIsUpdatingPdf(false);
    }
  }

  async function onSubmit(data: UpdateContractFormValues) {
    // Verificar se há erros no formulário
    if (Object.keys(form.formState.errors).length > 0) {
      const errorFields = Object.keys(form.formState.errors)
        .map((field) => {
          const fieldName = field as keyof typeof form.formState.errors;
          const errorMessage = form.formState.errors[fieldName]?.message;
          if (errorMessage) {
            return `${field}: ${errorMessage}`;
          }
          return field;
        })
        .join(", ");

      toast.error(`Por favor, corrija os seguintes campos: ${errorFields}`);
      return;
    }

    try {
      setIsGeneratingDocument(true);

      const contractUrl = await getContractPdfAndUpdateContract();
      console.log("contractUrl", contractUrl);

      await updateContractService({
        contractId: id,
        eventDate: data.eventDate,
        withdrawalDate: data.withdrawalDate,
        returnDate: data.returnDate,
        additionalInformation: data.additionalInformation,
        totalValue: data.totalValue,
        payments: data.paymentMethod.map((payment) => ({
          id: payment.id,
          method: payment.method,
          value: payment.value,
          creditParcelAmount: payment.creditParcelAmount,
          paymentDate: payment.paymentDate,
          isPaid: payment.isPaid,
        })),
        items: data.items?.map((item) => ({
          id: item.id,
          itemId: item.itemId,
          quantity: item.quantity,
          isBonus: item.isBonus,
          discount: item.discount,
          finalValue: item.finalValue,
        })),
        contractUrl:
          contractUrl ??
          contract.contractDocuments.find(
            (document) => document.type === ContractDocumentType.INVOICE
          )?.url,
      });

      toast.success("Contrato atualizado com sucesso!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar contrato");
    } finally {
      setIsGeneratingDocument(false);
    }
  }

  const addPayment = () => {
    const payments = form.getValues("paymentMethod") || [];
    form.setValue("paymentMethod", [
      ...payments,
      {
        method: PaymentMethod.CASH,
        value: 0,
        creditParcelAmount: 1,
        paymentDate: format(new Date(), "yyyy-MM-dd"),
        isPaid: false,
      },
    ]);
  };

  const removePayment = (index: number) => {
    const payments = form.getValues("paymentMethod") || [];
    form.setValue(
      "paymentMethod",
      payments.filter((_, i) => i !== index)
    );
  };

  const calculateTotalPaid = () => {
    const payments = form.getValues("paymentMethod") || [];
    // Somar apenas os pagamentos marcados como pagos (isPaid === true)
    return payments.reduce((acc, payment) => {
      return payment.isPaid ? acc + payment.value : acc;
    }, 0);
  };

  const calculatePendingDebt = () => {
    const totalPaid = calculateTotalPaid();
    const totalValue = form.getValues("totalValue") || 0;
    return totalValue - totalPaid;
  };

  const statusFormattedText = () => {
    const status = {
      [ContractStatus.OPEN]: "ABERTO",
      [ContractStatus.CLOSED]: "FECHADO",
      [ContractStatus.CANCELLED]: "CANCELADO",
      [ContractStatus.COLLECTED]: "COLETADO",
    };

    return status[contract.status];
  };

  const statusColorVariant = () => {
    const status: Record<ContractStatus, BadgeProps["variant"]> = {
      [ContractStatus.OPEN]: "yellow",
      [ContractStatus.CLOSED]: "indigo",
      [ContractStatus.CANCELLED]: "rose",
      [ContractStatus.COLLECTED]: "green",
    };

    return status[contract.status];
  };

  const handleCurrencyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");

    e.target.value = value;

    // Converter para número
    const numericValue =
      parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
    onChange(numericValue);
  };

  // Função para verificar se o pagamento é original do contrato
  const isOriginalPayment = (index: number) => {
    const payment = form.getValues("paymentMethod")[index];
    return !!payment.id;
  };

  // Função para confirmar remoção de pagamento
  const confirmRemovePayment = (index: number) => {
    if (isOriginalPayment(index)) {
      setPaymentToRemove(index);
      setIsOpenDialog(true);
    } else {
      removePayment(index);
    }
  };

  // Função para adicionar novos itens ao contrato
  const addNewItems = (newItems: Map<string, number>) => {
    const currentItems = form.getValues("items") || [];
    const itemsToAdd: typeof currentItems = [];

    // Buscar informações dos itens selecionados
    Array.from(newItems.entries()).forEach(([itemId, quantity]) => {
      // Buscar o item nos dados disponíveis
      const item = availableItems.find((i) => i.id === itemId);

      if (item) {
        itemsToAdd.push({
          itemId,
          quantity,
          isBonus: false,
          discount: 0,
          finalValue: item.price * quantity,
        });
      }
    });

    // Atualizar o formulário com os novos itens
    form.setValue("items", [...currentItems, ...itemsToAdd]);

    // Recalcular o valor total do contrato
    updateTotalValue();

    // Forçar atualização da UI
    form.trigger("items");
  };

  // Função para remover um item do contrato
  const removeItem = (index: number) => {
    const items = form.getValues("items") || [];
    const updatedItems = items.filter((_, i) => i !== index);
    form.setValue("items", updatedItems);

    // Recalcular o valor total do contrato
    updateTotalValue();
  };

  // Função para atualizar o valor de um item
  const updateItemValue = (
    index: number,
    discount: number,
    finalValue: number,
    discountMode?: "currency" | "percent"
  ) => {
    const items = form.getValues("items") || [];
    const updatedItems = [...items];

    // Atualizar o item com o novo desconto e valor final
    updatedItems[index] = {
      ...updatedItems[index],
      discount,
      finalValue,
      discountMode, // Armazenar o modo de desconto
    };

    form.setValue("items", updatedItems);

    // Recalcular o valor total do contrato
    updateTotalValue();
  };

  // Função para atualizar o valor total do contrato
  const updateTotalValue = () => {
    const items = form.getValues("items") || [];
    const totalValue = items.reduce((sum, item) => sum + item.finalValue, 0);
    form.setValue("totalValue", totalValue);

    // Recalcular o valor pendente
    const pendingDebt = calculatePendingDebt();

    // Atualizar a UI
    form.trigger("totalValue");
  };

  useEffect(() => {
    if (availabilityData?.data) {
      setAvailableItems(availabilityData.data);
    }
  }, [availabilityData]);

  return {
    form,
    onSubmit,
    isUpdatingContract,
    isGeneratingDocument,
    addPayment,
    removePayment,
    calculateTotalPaid,
    calculatePendingDebt,
    contract,
    statusFormattedText,
    statusColorVariant,
    handleCurrencyInputChange,
    paymentToRemove,
    setPaymentToRemove,
    confirmRemovePayment,
    addNewItems,
    removeItem,
    updateItemValue,
    updateTotalValue,
    availableItems,
    isUpdatingPdf,
    isOpenDialog,
    setIsOpenDialog,
  };
}
