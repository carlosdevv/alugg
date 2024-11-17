"use client";
import { useCreateOrganizationService } from "@/http/organizations/use-organizations-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

export default function useCreateOrganizationModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationFormSchema),
  });

  const { mutateAsync: createOrganization, isPending } =
    useCreateOrganizationService();

  const onClose = useCallback(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("modal");
    router.replace(`${pathname}?${nextSearchParams}`);
    setShowModal(false);
  }, [pathname, router, searchParams]);

  async function onSubmit(data: CreateOrganizationFormValues) {
    const props = {
      ...data,
      plan: data.plan || "free",
    };

    await createOrganization(props);
    form.reset();
  }

  useEffect(() => {
    const isShowModal = searchParams.get("modal") === "create-organization";

    if (isShowModal) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [searchParams]);

  return { form, onSubmit, isPending, onClose, showModal, setShowModal };
}
