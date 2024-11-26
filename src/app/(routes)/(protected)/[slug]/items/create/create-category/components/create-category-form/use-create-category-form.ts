import { useCreateCategoryService } from "@/http/category/use-categories-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createCategoryFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
});

type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;

export default function useCreateCategoryForm() {
  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategoryFormSchema),
  });

  const { mutate: createCategoryService } = useCreateCategoryService();

  async function onSubmit(data: CreateCategoryFormValues) {
    await createCategoryService({
      name: data.name,
      slug: window.location.pathname.split("/")[3],
    });
  }

  return { form, onSubmit };
}
