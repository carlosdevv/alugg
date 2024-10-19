import { useCreateOrganizationService } from "@/http/organizations/use-organizations-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createOrganizationOnboardingFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  plan: z.enum(["free", "pro"]).optional(),
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
    const props = {
      ...data,
      plan: data.plan || "free",
    };

    await createOrganization(props);
  }
  return { form, onSubmit, isPending };
}
