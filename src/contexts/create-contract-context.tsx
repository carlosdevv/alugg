import { zodResolver } from "@hookform/resolvers/zod";
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
};

const createContractFormSchema = z
  .object({
    customerId: z.string({ required_error: "Cliente é obrigatório" }),
    eventDate: z.string({ required_error: "Data do evento é obrigatória" }),
    withdrawalDate: z.string({
      required_error: "Data de retirada é obrigatória",
    }),
    returnDate: z.string({ required_error: "Data de devolução é obrigatória" }),
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

type CreateContractFormValues = z.infer<typeof createContractFormSchema>;

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

  async function onSubmit(data: CreateContractFormValues) {
    console.log(data);
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
      }}
    >
      {children}
    </CreateContractContext.Provider>
  );
}

export function useCreateContractContext() {
  return useContext(CreateContractContext);
}
