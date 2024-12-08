import { useGetCategoriesService } from "@/http/category/use-categories-service";
import { useCreateItemService } from "@/http/items/use-items-service";
import { formatCurrencyToNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createItemFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  categoryId: z.string({ required_error: "Selecione ao menos uma categoria" }),
  amount: z.coerce
    .number({
      required_error: "Quantidade é obrigatória",
      invalid_type_error: "Quantidade deve ser um número",
    })
    .positive({ message: "Quantidade deve ser maior que 0" }),
  objectPrice: z.string({ required_error: "Valor do Objeto é obrigatório" }),
  rentPrice: z.string({ required_error: "Valor do Aluguel é obrigatório" }),
  size: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  itemInRenovation: z.coerce.boolean().default(false),
  itemInactive: z.coerce.boolean().default(false),
  imageUrl: z.string().url().optional(),
});

type CreateItemFormValues = z.infer<typeof createItemFormSchema>;

export default function useCreateItemForm() {
  const { slug } = useParams() as { slug: string };

  const router = useRouter();

  const form = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemFormSchema),
    defaultValues: {
      itemInactive: false,
      itemInRenovation: false,
      imageUrl: undefined,
    },
  });

  const [, setModal] = useQueryState("modal");

  const { data: categories } = useGetCategoriesService(
    { slug },
    { enabled: !!slug, queryKey: ["getCategories", slug] }
  );

  const { mutateAsync: createItemService } = useCreateItemService({
    onSuccess: () => {
      form.reset();
      router.push(`/${slug}/items`);
    },
  });

  async function onSubmit(data: CreateItemFormValues) {
    console.log(formatCurrencyToNumber(data.rentPrice));
    await createItemService({
      slug,
      itemToCreate: {
        description: data.description,
        imageUrl: data.imageUrl,
        status: data.itemInactive === false ? "ACTIVE" : "INACTIVE",
        amount: data.amount,
        rentPrice: formatCurrencyToNumber(data.rentPrice),
        objectPrice: formatCurrencyToNumber(data.objectPrice),
        categoryId: data.categoryId,
        name: data.name,
        itemInRenovation: data.itemInRenovation,
        code: data.code,
        size: data.size,
        color: data.color,
      },
    });
  }

  return { form, onSubmit, categories, setModal };
}
