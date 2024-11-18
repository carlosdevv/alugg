import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateCategoryService } from "@/http/category/use-categories-service";
import { useState } from "react";

const updateCategoryFormSchema = z.object({
  categoryId: z.string({ required_error: "Id é obrigatório" }),
  name: z.string().optional(),
  inventoryId: z.string().optional(),
});

type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>;

export default function useUpdateCategoryForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategoryFormSchema),
  });

  
  const { mutate: updateCategoryService } = useUpdateCategoryService();

  async function onSubmit(data: UpdateCategoryFormValues) {
    console.log(data)
    setError(null);
    setSuccess(false);
    try {
      await updateCategoryService(data);
      form.reset();
      setSuccess(true);
    } catch (error) {
      setError("Falha ao editar categoria. Tente novamente.");
      console.error("Error updating category:", error);
    }
  }

  return { form, onSubmit, error, success };
}
