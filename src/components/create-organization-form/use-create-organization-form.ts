"use client";
import { useCreateOrganizationService } from "@/http/organizations/use-organizations-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createOrganizationFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
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
  }

  return { form, onSubmit, isPending };
}