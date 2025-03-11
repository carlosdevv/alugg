import { useCreateContractService } from "@/http/contracts/use-contracts-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethod } from "@prisma/client";
import { compareDesc } from "date-fns";
import { parseAsInteger, useQueryState, type Options } from "nuqs";
import { createContext, useContext, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
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

export function CreateContractProvider({
  children,
}: CreateContractProviderProps) {
  const form = useForm<CreateContractFormValues>({
    resolver: zodResolver(createContractFormSchema),
    mode: "onBlur",
  });

  const [currentStep, setCurrentStep] = useQueryState("step", {
    ...parseAsInteger,
    defaultValue: 1,
  });
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(
    new Map()
  );
  const [totalValue, setTotalValue] = useState(0);

  const { mutateAsync: createContract, isPending: isCreatingContract } =
    useCreateContractService();

  async function onSubmit(data: CreateContractFormValues) {
    console.log(data);
    const { items, ...rest } = data;

    const props = {
      totalValue,
      ...rest,
      items: items.map((item) => {
        let discountValue = 0;
        if (item.discount) {
          if (item.discount.mode === "percent") {
            discountValue = (item.discount.value / 100) * item.finalValue / (1 - item.discount.value / 100);
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

    await createContract(props);
  }

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
      }}
    >
      {children}
    </CreateContractContext.Provider>
  );
}

export function useCreateContractContext() {
  return useContext(CreateContractContext);
}
