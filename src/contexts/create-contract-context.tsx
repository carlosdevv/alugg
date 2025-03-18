import { ContractPDF } from "@/components/contract-pdf/contract-pdf";
import {
  useCreateContractService,
  useGetNextContractCodeService,
} from "@/http/contracts/use-contracts-service";
import type { CustomerProps } from "@/http/customers/types";
import { useGetCustomerByIdService } from "@/http/customers/use-customers-service";
import type { ItemProps } from "@/http/items/types";
import { useGetItemsService } from "@/http/items/use-items-service";
import type { GetMemberByIdServiceResponse } from "@/http/members/types";
import { useGetMemberByIdService } from "@/http/members/use-members-service";
import type { OrganizationProps } from "@/http/organizations/types";
import { useGetOrganizationService } from "@/http/organizations/use-organizations-service";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethod } from "@prisma/client";
import { pdf } from "@react-pdf/renderer";
import { compareDesc } from "date-fns";
import { useParams } from "next/navigation";
import { parseAsInteger, useQueryState, type Options } from "nuqs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const CreateContractContext = createContext(
  {} as CreateContractContextProps
);

type CreateContractProviderProps = {
  children: React.ReactNode;
};

type CreateContractContextProps = {
  currentStep: number;
  setCurrentStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  form: UseFormReturn<CreateContractFormValues>;
  onSubmit: (data: CreateContractFormValues) => void;
  selectedItems: Map<string, number>;
  setSelectedItems: (items: Map<string, number>) => void;
  totalValue: number;
  setTotalValue: (value: number) => void;
  isCreatingContract: boolean;
  nextContractCode?: number;
  generateContractPDF: () => Promise<Blob>;
  organization?: OrganizationProps;
  customer?: CustomerProps;
  items?: ItemProps[];
  seller?: GetMemberByIdServiceResponse;
  isUploadingPdf: boolean;
};

export const createContractFormSchema = z
  .object({
    customerId: z.string({ required_error: "Cliente é obrigatório" }),
    eventDate: z.string({ required_error: "Data do evento é obrigatória" }),
    withdrawalDate: z.string({
      required_error: "Data de retirada é obrigatória",
    }),
    returnDate: z.string({ required_error: "Data de devolução é obrigatória" }),
    memberId: z.string({ required_error: "Membro é obrigatório" }),
    additionalInformation: z.string().optional(),
    items: z.array(
      z.object({
        itemId: z.string(),
        quantity: z.number(),
        isBonus: z.boolean().default(false),
        baseValue: z.number(),
        discount: z.object({
          value: z.number().default(0),
          mode: z.enum(["currency", "percent"]).default("currency"),
        }),
        finalValue: z.number(),
      })
    ),
    paymentMethod: z.array(
      z.object({
        method: z.nativeEnum(PaymentMethod, {
          required_error: "Método de pagamento é obrigatório",
        }),
        value: z.number(),
        creditParcelAmount: z.number({
          required_error: "Parcelas são obrigatórias",
        }),
        paymentDate: z.string({
          required_error: "Data de pagamento é obrigatória",
        }),
        isPaid: z.boolean({
          required_error: "Status de pagamento é obrigatório",
        }),
      })
    ),
  })
  .superRefine((data, ctx) => {
    if (
      compareDesc(new Date(data.withdrawalDate), new Date(data.eventDate)) ===
      -1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data de retirada deve ser antes da data do evento",
        path: ["withdrawalDate"],
      });
    }

    if (
      compareDesc(new Date(data.returnDate), new Date(data.eventDate)) === 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data do devolução deve ser depois da data do evento",
        path: ["returnDate"],
      });
    }
  });

export type CreateContractFormValues = z.infer<typeof createContractFormSchema>;

export const CreateContractProvider = ({
  children,
}: CreateContractProviderProps) => {
  const { slug } = useParams() as { slug: string };

  const form = useForm<CreateContractFormValues>({
    resolver: zodResolver(createContractFormSchema),
    mode: "onSubmit",
  });

  const [currentStep, setCurrentStep] = useQueryState("step", {
    ...parseAsInteger,
    defaultValue: 1,
  });
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(
    new Map()
  );
  const [totalValue, setTotalValue] = useState(0);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const { mutateAsync: createContract, isPending: isCreatingContract } =
    useCreateContractService();

  const { data: nextContractCodeResponse } = useGetNextContractCodeService({
    slug,
  });

  const nextContractCode = useMemo(
    () => nextContractCodeResponse?.data.nextCode,
    [nextContractCodeResponse]
  );

  const { data: organization } = useGetOrganizationService(
    { slug },
    {
      queryKey: ["getOrganization", slug],
      enabled: currentStep === 4,
    }
  );

  const { data: customer } = useGetCustomerByIdService(
    {
      slug,
      customerId: form.watch("customerId"),
    },
    {
      queryKey: ["getCustomerById", form.watch("customerId")],
      enabled: currentStep === 4 && !!form.watch("customerId"),
    }
  );

  const { data: items } = useGetItemsService(
    { slug },
    {
      queryKey: ["getItems", slug],
      enabled: currentStep === 4,
    }
  );

  const { data: seller } = useGetMemberByIdService(
    {
      slug,
      memberId: form.watch("memberId"),
    },
    {
      queryKey: ["getMemberById", form.watch("memberId")],
      enabled: currentStep === 4 && !!form.watch("memberId"),
    }
  );

  async function generateContractPDF() {
    const formValues = form.getValues();
    const formItems = formValues.items || [];

    // Mapear os itens do formulário com os dados completos dos itens
    const selectedItemsData = formItems
      .map((formItem) => {
        const itemData = items?.find((item) => item.id === formItem.itemId);
        if (!itemData || !itemData.name) return null;

        return {
          ...itemData,
          quantity: formItem.quantity,
          isBonus: formItem.isBonus,
          baseValue: formItem.baseValue,
          discount: formItem.discount,
          finalValue: formItem.finalValue,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // Gerar o PDF
    const blob = await pdf(
      <ContractPDF
        organization={organization}
        customer={customer}
        items={selectedItemsData}
        totalValue={totalValue}
        seller={seller}
        formValues={formValues}
        code={nextContractCode}
      />
    ).toBlob();

    return blob;
  }

  async function uploadContractPdfAndGetUrl() {
    setIsUploadingPdf(true);
    try {
      const supabase = createClient();
      const pdfBlob = await generateContractPDF();

      const fileName = `${slug}/${slug}-contrato-${nextContractCode}.pdf`;

      const { error: supabaseError } = await supabase.storage
        .from("organization-contracts")
        .upload(fileName, pdfBlob);

      if (supabaseError) {
        console.error("Error uploading contract PDF", supabaseError);
        toast.warning(
          "Não foi possível fazer upload do contrato, tente novamente."
        );
        return null;
      }

      const { data } = await supabase.storage
        .from("organization-contracts")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Error generating or uploading PDF", error);
      toast.error("Erro ao gerar ou fazer upload do PDF do contrato");
      return null;
    } finally {
      setIsUploadingPdf(false);
    }
  }

  async function onSubmit(data: CreateContractFormValues) {
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

    const { items, ...rest } = data;
    const contractPdfUrl = await uploadContractPdfAndGetUrl();

    if (!contractPdfUrl) {
      toast.error("Não foi possível gerar o contrato. Tente novamente.");
      return;
    }

    // Extrair o nome do arquivo da URL
    const fileName = contractPdfUrl.split("/").pop();

    const props = {
      totalValue,
      ...rest,
      contractUrl: contractPdfUrl,
      code: nextContractCode,
      items: items.map((item) => {
        let discountValue = 0;
        if (item.discount) {
          if (item.discount.mode === "percent") {
            discountValue =
              ((item.discount.value / 100) * item.finalValue) /
              (1 - item.discount.value / 100);
          } else {
            discountValue = item.discount.value;
          }
        }

        return {
          ...item,
          discount: discountValue,
        };
      }),
    };

    try {
      await createContract(props);
    } catch (error) {
      // Se a criação do contrato falhar, remover o PDF do Supabase
      if (fileName) {
        const supabase = createClient();
        await supabase.storage
          .from("organization-contracts")
          .remove([fileName]);

        console.error("Erro ao criar contrato, PDF removido:", fileName);
      }

      toast.error("Erro ao criar o contrato. O arquivo PDF foi removido.");
      throw error; // Propagar o erro para tratamento adicional, se necessário
    }
  }

  // Efeito para verificar se as datas estão preenchidas quando o usuário está nas steps 2, 3 ou 4
  useEffect(() => {
    const checkDatesAndRedirect = async () => {
      if (currentStep > 1) {
        const formValues = form.getValues();
        const { eventDate, withdrawalDate, returnDate } = formValues;

        if (!eventDate || !withdrawalDate || !returnDate) {
          toast.warning("Por favor, preencha as datas do contrato primeiro.");
          await setCurrentStep(1);
        }
      }
    };

    checkDatesAndRedirect();
  }, [currentStep, form, setCurrentStep]);

  return (
    <CreateContractContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        form,
        onSubmit,
        selectedItems,
        setSelectedItems,
        totalValue,
        setTotalValue,
        isCreatingContract,
        nextContractCode,
        generateContractPDF,
        organization,
        customer,
        items,
        seller,
        isUploadingPdf,
      }}
    >
      {children}
    </CreateContractContext.Provider>
  );
};

export function useCreateContractContext() {
  return useContext(CreateContractContext);
}
