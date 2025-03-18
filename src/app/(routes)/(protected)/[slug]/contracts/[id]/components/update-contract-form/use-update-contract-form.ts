import type { BadgeProps } from "@/components/ui/badge";
import type { ContractProps } from "@/http/contracts/types";
import { useUpdateContractService } from "@/http/contracts/use-contracts-service";
import { useGetItemsAvailabilityService } from "@/http/items/use-items-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractStatus, PaymentMethod } from "@prisma/client";
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
  payments: z.array(paymentMethodSchema),
  items: z.array(rentedItemSchema).optional(),
  customerId: z.string().optional(),
  memberId: z.string().optional(),
  totalValue: z.number().optional(),
});

type UpdateContractFormValues = z.infer<typeof updateContractFormSchema>;

type UseUpdateContractFormProps = {
  contract: ContractProps;
};

export default function useUpdateContractForm({
  contract,
}: UseUpdateContractFormProps) {
  const router = useRouter();
  const { id, slug } = useParams() as { id: string; slug: string };
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [paymentToRemove, setPaymentToRemove] = useState<number | null>(null);
  const [availableItems, setAvailableItems] = useState<any[]>([]);

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

  const form = useForm<UpdateContractFormValues>({
    resolver: zodResolver(updateContractFormSchema),
    defaultValues: {
      eventDate: formatDate(contract?.eventDate || new Date()),
      withdrawalDate: formatDate(contract?.withdrawalDate || new Date()),
      returnDate: formatDate(contract?.returnDate || new Date()),
      additionalInformation: contract?.additionalInformation || "",
      customerId: contract?.customer?.id || "",
      totalValue: contract?.totalValue || 0,
      payments:
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
        !!form.watch("returnDate"),
      queryKey: [
        "getItemsAvailability",
        slug,
        form.watch("eventDate"),
        form.watch("withdrawalDate"),
        form.watch("returnDate"),
      ],
    }
  );

  useEffect(() => {
    if (availabilityData?.data) {
      setAvailableItems(availabilityData.data);
    }
  }, [availabilityData]);

  async function onSubmit(data: UpdateContractFormValues) {
    try {
      setIsGeneratingDocument(true);

      const contractUrl = ""; // URL do documento gerado

      await updateContractService({
        contractId: id,
        eventDate: data.eventDate,
        withdrawalDate: data.withdrawalDate,
        returnDate: data.returnDate,
        additionalInformation: data.additionalInformation,
        customerId: data.customerId,
        memberId: data.memberId,
        totalValue: data.totalValue,
        payments: data.payments.map((payment) => ({
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
        contractUrl: contractUrl || undefined,
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
    const payments = form.getValues("payments") || [];
    form.setValue("payments", [
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
    const payments = form.getValues("payments") || [];
    form.setValue(
      "payments",
      payments.filter((_, i) => i !== index)
    );
  };

  const calculateTotalPaid = () => {
    const payments = form.getValues("payments") || [];
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
    const payment = form.getValues("payments")[index];
    return !!payment.id;
  };

  // Função para confirmar remoção de pagamento
  const confirmRemovePayment = (index: number) => {
    if (isOriginalPayment(index)) {
      setPaymentToRemove(index);
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
          finalValue: item.rentPrice * quantity,
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
  };
}
