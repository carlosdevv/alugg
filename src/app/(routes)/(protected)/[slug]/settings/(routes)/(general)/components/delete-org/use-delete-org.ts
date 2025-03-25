import type { GetOrganizationResponse } from "@/http/organizations/types";
import { useDeleteOrganizationService } from "@/http/organizations/use-organizations-service";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const confirmDeleteOrgFormSchema = z.object({
  organization_slug: z.string({ required_error: "Slug é obrigatório" }),
  verification: z
    .string({ required_error: "Confirmação é obrigatória" })
    .refine((value) => value === "deletar organização", {
      message: "Digite 'deletar organização' para continuar",
    }),
});

type ConfirmDeleteOrgFormValues = z.infer<typeof confirmDeleteOrgFormSchema>;

type UseDeleteOrgProps = {
  organization: GetOrganizationResponse;
};

export default function useDeleteOrg({ organization }: UseDeleteOrgProps) {
  const form = useForm<ConfirmDeleteOrgFormValues>({
    resolver: zodResolver(confirmDeleteOrgFormSchema),
  });

  const { userId } = useAuth();

  const isOwner = organization.ownerId === userId;
  const [showModal, setShowModal] = useState(false);

  const { mutateAsync: deleteOrganization, isPending } =
    useDeleteOrganizationService();

  async function onSubmit(data: ConfirmDeleteOrgFormValues) {
    if (data.organization_slug !== organization.slug) {
      form.setError("organization_slug", {
        type: "manual",
        message: "Slug incorreto",
      });
      return;
    }

    await deleteOrganization({ slug: organization.slug });
  }

  return { form, onSubmit, isPending, isOwner, showModal, setShowModal };
}
