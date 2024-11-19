import { useGetCategoriesService } from "@/http/category/use-categories-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createItemFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  category: z.string({ required_error: "Selecione ao menos uma categoria" }),
  amount: z.coerce
    .number({
      required_error: "Quantidade é obrigatória",
      invalid_type_error: "Quantidade deve ser um número",
    })
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
  itemInactive: z.coerce.boolean().default(false),
});

type CreateItemFormValues = z.infer<typeof createItemFormSchema>;

export default function useCreateItemForm() {
  const { slug } = useParams() as { slug: string };

  const form = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemFormSchema),
    defaultValues: {
      itemInactive: false,
      itemInRenovation: false,
    },
  });

  const [, setModal] = useQueryState("modal");

  const { data: categories } = useGetCategoriesService(
    { slug },
    { enabled: !!slug, queryKey: ["getCategories", slug] }
  );

  function onSubmit(data: CreateItemFormValues) {
    console.log(data);
  }

  return { form, onSubmit, categories, setModal };
}
