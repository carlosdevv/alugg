import { consultaCep } from "@/http/consulta-cep";
import type { GetOrganizationResponse } from "@/http/organizations/types";
import { useUpdateOrganizationService } from "@/http/organizations/use-organizations-service";
import { parseToNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateOrgDataFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }).max(32, {
    message: "Máximo de 32 caracteres",
  }),
  fantasyName: z.string().optional(),
  socialName: z.string().optional(),
  cnpj: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return value.length === 14 || value.length === 18;
      },
      { message: "CNPJ inválido" }
    ),
  phone: z.string().optional(),
  email: z.string().optional(),
  zipcode: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        if (value.length === 8 || (value.length === 9 && value.includes("-")))
          return true;
        return false;
      },
      {
        message: "CEP inválido",
      }
    ),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
});

type UpdateOrgDataValues = z.infer<typeof updateOrgDataFormSchema>;

type UseUpdateOrgDataFormProps = {
  organization: GetOrganizationResponse;
};

export default function useUpdateOrgDataForm({
  organization,
}: UseUpdateOrgDataFormProps) {
  const form = useForm<UpdateOrgDataValues>({
    resolver: zodResolver(updateOrgDataFormSchema),
    defaultValues: {
      name: organization.name || "",
      fantasyName: organization.fantasyName || "",
      socialName: organization.socialName || "",
      cnpj: organization.cnpj?.toString() || "",
      phone: organization.phone || "",
      email: organization.email || "",
      zipcode: organization.zipcode || "",
      address: organization.address || "",
      city: organization.city || "",
      state: organization.state || "",
      neighborhood: organization.neighborhood || "",
    },
  });

  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const { mutateAsync: updateOrganization, isPending } =
    useUpdateOrganizationService({ slug: organization.slug });

  async function handleSearchAddress(zipcode: string) {
    setIsLoadingAddress(true);
    form.clearErrors("zipcode");
    const addressProps = await consultaCep({
      cep: zipcode,
    });

    if (!addressProps) {
      form.setValue("address", "");
      form.setValue("city", "");
      form.setValue("state", "");
      form.setValue("neighborhood", "");
      setIsLoadingAddress(false);
      return;
    }

    form.setValue("address", addressProps.logradouro || "");
    form.setValue("city", addressProps.localidade || "");
    form.setValue("state", addressProps.estado || "");
    form.setValue("neighborhood", addressProps.bairro || "");
    form.setValue("zipcode", addressProps.cep || "");
    setIsLoadingAddress(false);
  }

  async function onSubmit(data: UpdateOrgDataValues) {
    await updateOrganization({
      ...data,
      cnpj: data.cnpj ? parseToNumber(data.cnpj) : undefined,
    });
  }

  return { form, onSubmit, isPending, isLoadingAddress, handleSearchAddress };
}
