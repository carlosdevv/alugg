import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCategoryService } from "@/http/category/use-categories-service";

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
    await createCategoryService(data)
    console.log(data);
  }

  return { form, onSubmit };
}
