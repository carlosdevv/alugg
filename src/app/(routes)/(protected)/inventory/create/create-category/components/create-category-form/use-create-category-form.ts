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

  function onSubmit(data: CreateCategoryFormValues) {
    console.log(data);
  }

  return { form, onSubmit };
}
