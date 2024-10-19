"use client";
import { useCreateOrganizationService } from "@/http/organizations/use-organizations-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createOrganizationFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }).max(32, {
    message: "Máximo de 32 caracteres",
  }),
  slug: z
    .string({ required_error: "Slug é obrigatório" })
    .min(3, { message: "Slug deve ter no mínimo 3 caracteres" })
    .max(48, { message: "Slug deve ter no máximo 48 caracteres" })
    .regex(/^[a-zA-Z0-9\-]+$/, {
      message: "Slug deve conter apenas letras, números e hífens",
    }),
  plan: z.enum(["free", "pro"]).optional(),
});

type CreateOrganizationFormValues = z.infer<
  typeof createOrganizationFormSchema
>;

export default function useCreateOrganizationForm() {
  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationFormSchema),
  });

  const { mutateAsync: createOrganization, isPending } =
    useCreateOrganizationService();

  async function onSubmit(data: CreateOrganizationFormValues) {
    const props = {
      ...data,
      plan: data.plan || "free",
    };

    await createOrganization(props);
    form.reset();
  }

  return { form, onSubmit, isPending };
}
