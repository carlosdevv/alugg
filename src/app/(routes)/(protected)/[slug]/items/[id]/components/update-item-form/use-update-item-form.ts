import { useUpdateItemByIdService } from "@/http/items/use-items-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateItemFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  categoryId: z.string({ required_error: "Selecione ao menos uma categoria" }),
  amount: z.coerce
    .number({ required_error: "Quantidade é obrigatória" })
    .positive({ message: "Quantidade deve ser maior que 0" }),
  objectPrice: z
    .number({ required_error: "Valor do Objeto é obrigatório" })
    .positive({ message: "Valor do Objeto deve ser maior que 0" }),
  rentPrice: z
    .number({ required_error: "Valor do Aluguel é obrigatório" })
    .positive({ message: "Valor do Aluguel deve ser maior que 0" }),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  itemInRenovation: z.coerce.boolean().optional(),
  status: z.string().optional().nullable(),
});

type UpdateItemFormValues = z.infer<typeof updateItemFormSchema>;

type UseUpdateItemFormProps = {
  item: UpdateItemFormValues;
  id: string;
  slug: string;
};
export default function useUpdateItemForm({
  item,
  id,
  slug,
}: UseUpdateItemFormProps) {
  const form = useForm<UpdateItemFormValues>({
    resolver: zodResolver(updateItemFormSchema),
    defaultValues: {
      ...item,
    },
  });

  const { mutateAsync: updateItemMutation } = useUpdateItemByIdService();

  async function onSubmit(data: UpdateItemFormValues) {
    const itemToUpdate = {
      name: data.name ?? undefined,
      categoryId: data.categoryId ?? undefined,
      amount: data.amount ?? undefined,
      objectPrice: data.objectPrice ?? undefined,
      rentPrice: data.rentPrice ?? undefined,
      size: data.size ?? undefined,
      color: data.color ?? undefined,
      description: data.description ?? undefined,
      code: data.code ?? undefined,
      itemInRenovation: data.itemInRenovation,
      status: data.status ?? undefined,
    };

    await updateItemMutation({
      id,
      slug,
      updatedItem: itemToUpdate,
    });
  }

  return { form, onSubmit };
}
