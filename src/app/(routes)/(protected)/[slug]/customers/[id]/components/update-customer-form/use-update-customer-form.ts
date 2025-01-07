import { consultaCep } from "@/http/consulta-cep";
import type { CustomerProps } from "@/http/customers/types";
import { useUpdateCustomerService } from "@/http/customers/use-customers-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateCustomerFormSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  document: z.string({ required_error: "CPF/CNPJ é obrigatório" }).refine(
    (value) => {
      if (value.length === 11) {
        return true;
      }

      if (value.length === 14) {
        return true;
      }

      return false;
    },
    { message: "CPF/CNPJ inválido" }
  ),
  secondDocument: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) {
          return value.length === 10;
        }
        return true;
      },
      { message: "RG inválido" }
    ),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthdate: z.string().optional(),
  mediaContact: z.string().optional(),
  additionalInformation: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
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
});

type UpdateCustomerFormValues = z.infer<typeof updateCustomerFormSchema>;

type useUpdateCustomerFormProps = {
  customer: CustomerProps;
  id: string;
};

export default function useUpdateCustomerForm({
  customer,
  id,
}: useUpdateCustomerFormProps) {
  const { slug } = useParams() as { slug: string };

  const form = useForm<UpdateCustomerFormValues>({
    resolver: zodResolver(updateCustomerFormSchema),
    defaultValues: {
      name: customer.name,
      document: customer.document,
      secondDocument: customer.secondDocument,
      email: customer.email,
      phone: customer.phone,
      birthdate: customer.birthdate,
      mediaContact: customer.mediaContact,
      additionalInformation: customer.additionalInformation,
      neighborhood: customer.neighborhood,
      city: customer.city,
      state: customer.state,
      zipcode: customer.zipcode,
      address: customer.address,
    },
  });

  const [showAddressFields, setShowAddressFields] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const { mutateAsync: updateCustomerService, isPending: isUpdatingCustomer } =
    useUpdateCustomerService(
      { customerId: id, slug },
      {
        onSuccess: () => {
          toast.success("Cliente atualizado com sucesso");
        },
      }
    );

  async function handleSearchAddress(zipcode: string) {
    setIsLoadingAddress(true);
    form.clearErrors("zipcode");
    const addressProps = await consultaCep({
      cep: zipcode,
    });

    if (addressProps === null) {
      form.setValue("address", "");
      form.setValue("city", "");
      form.setValue("state", "");
      form.setValue("neighborhood", "");
    }

    if (addressProps) {
      form.setValue("address", addressProps.logradouro);
      form.setValue("city", addressProps.localidade);
      form.setValue("state", addressProps.estado);
      form.setValue("neighborhood", addressProps.bairro);
      form.setValue("zipcode", addressProps.cep);
    }

    setShowAddressFields(true);
    setIsLoadingAddress(false);
  }

  async function onSubmit(data: UpdateCustomerFormValues) {
    console.log("createCustomer", data);
    await updateCustomerService({
      ...data,
    });
  }

  return {
    form,
    onSubmit,
    isLoadingAddress,
    handleSearchAddress,
    showAddressFields,
    isUpdatingCustomer,
  };
}
