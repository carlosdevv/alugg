import type { GetOrganizationResponse } from "@/http/organizations/types";
import { useUpdateOrganizationService } from "@/http/organizations/use-organizations-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const changeOrgNameFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }).max(32, {
    message: "Máximo de 32 caracteres",
  }),
});

type ChangeOrgNameValues = z.infer<typeof changeOrgNameFormSchema>;

type UseChangeOrgNameFormProps = {
  organization: GetOrganizationResponse;
};

export default function useChangeOrgNameForm({
  organization,
}: UseChangeOrgNameFormProps) {
  const form = useForm<ChangeOrgNameValues>({
    resolver: zodResolver(changeOrgNameFormSchema),
    defaultValues: {
      name: organization.name,
    },
  });

  const { mutateAsync: updateOrganization, isPending } =
    useUpdateOrganizationService();

  async function onSubmit(data: ChangeOrgNameValues) {
    await updateOrganization({ slug: organization.slug, name: data.name });
  }

  return { form, onSubmit, isPending };
}
