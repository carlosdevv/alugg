import { consultaCep } from "@/http/consulta-cep";
import { useCreateCustomerService } from "@/http/customers/use-customers-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createCustomerFormSchema = z.object({
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

type CreateCustomerFormValues = z.infer<typeof createCustomerFormSchema>;

export default function useCreateCustomerForm() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(createCustomerFormSchema),
  });

  const [showAddressFields, setShowAddressFields] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const { mutateAsync: createCustomerService, isPending: isCreatingCustomer } =
    useCreateCustomerService(
      { slug },
      {
        onSuccess: () => {
          form.reset();
          router.push(`/${slug}/customers`);
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

  async function onSubmit(data: CreateCustomerFormValues) {
    console.log("createCustomer", data);
    await createCustomerService({
      ...data,
    });
  }

  return {
    form,
    onSubmit,
    isCreatingCustomer,
    showAddressFields,
    isLoadingAddress,
    handleSearchAddress,
  };
}
