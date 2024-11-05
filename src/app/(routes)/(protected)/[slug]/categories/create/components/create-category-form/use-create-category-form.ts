import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCategoryService } from "@/http/category/use-categories-service";
import { useState } from "react";

const createCategoryFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
});

type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;

export default function useCreateCategoryForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategoryFormSchema),
  });

  const { mutate: createCategoryService } = useCreateCategoryService();

  async function onSubmit(data: CreateCategoryFormValues) {
    setError(null);
    setSuccess(false);
    try {
      await createCategoryService(data);
      form.reset();
      setSuccess(true);
    } catch (error) {
      setError("Falha ao criar categoria. Tente novamente.");
      console.error("Error creating category:", error);
    }
  }

  return { form, onSubmit, error, success };
}
