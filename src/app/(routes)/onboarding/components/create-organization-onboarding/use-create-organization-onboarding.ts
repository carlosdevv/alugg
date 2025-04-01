import { useCreateOrganizationService } from "@/http/organizations/use-organizations-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createOrganizationOnboardingFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  plan: z.enum(["free", "pro"]).default("free"),
  slug: z.string({ required_error: "Slug é obrigatório" }),
});

type CreateOrganizationOnboardingFormValues = z.infer<
  typeof createOrganizationOnboardingFormSchema
>;

export default function useCreateOrganizationOnboarding() {
  const form = useForm<CreateOrganizationOnboardingFormValues>({
    resolver: zodResolver(createOrganizationOnboardingFormSchema),
  });

  const { mutateAsync: createOrganization, isPending } =
    useCreateOrganizationService();

  async function onSubmit(data: CreateOrganizationOnboardingFormValues) {
    await createOrganization(data);
  }
  return { form, onSubmit, isPending };
}
