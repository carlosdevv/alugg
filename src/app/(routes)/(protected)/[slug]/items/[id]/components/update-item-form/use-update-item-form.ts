import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateItemFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  category: z.object({
    name: z.string({ required_error: "Nome da categoria é obrigatório" }),
  }),
  amount: z.coerce
    .number({ required_error: "Quantidade é obrigatória" })
    .positive({ message: "Quantidade deve ser maior que 0" }),
  objectPrice: z
    .number({ required_error: "Valor do Objeto é obrigatório" })
    .positive({ message: "Valor do Objeto deve ser maior que 0" }),
  rentPrice: z
    .number({ required_error: "Valor do Aluguel é obrigatório" })
    .positive({ message: "Valor do Aluguel deve ser maior que 0" }),
  size: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  itemInRenovation: z.coerce.boolean().default(false),
  status: z.string().default("ACTIVE"),
});

type UpdateItemFormValues = z.infer<typeof updateItemFormSchema>;

type UseUpdateItemFormProps = {
  item: UpdateItemFormValues;
};
export default function useUpdateItemForm({ item }: UseUpdateItemFormProps) {
  const form = useForm<UpdateItemFormValues>({
    resolver: zodResolver(updateItemFormSchema),
    defaultValues: {
      ...item,
    },
  });

  function onSubmit(data: UpdateItemFormValues) {
    console.log(data);
  }

  return { form, onSubmit };
}
