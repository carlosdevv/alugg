import { useCreateInviteService } from "@/http/invites/use-invites-service";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Role } from "@prisma/client";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createInviteFormSchema = z.object({
  email: z.string({ required_error: "Email é obrigatório" }).email({
    message: "Email inválido",
  }),
});

type CreateInviteFormValues = z.infer<typeof createInviteFormSchema>;

export default function useCreateInviteModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const [showModal, setShowModal] = useState(false);
  const [roleSelected, setRoleSelected] = useState<Role>("MEMBER");

  const form = useForm<CreateInviteFormValues>({
    resolver: zodResolver(createInviteFormSchema),
  });

  const {
    mutateAsync: createInviteService,
    isPending,
    isSuccess,
  } = useCreateInviteService();

  const onClose = useCallback(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("modal");
    router.replace(`${pathname}?${nextSearchParams}`);
    setShowModal(false);
  }, [pathname, router, searchParams]);

  async function onSubmit(data: CreateInviteFormValues) {
    const props = {
      ...data,
      slug,
      role: roleSelected,
    };

    toast.promise(createInviteService(props), {
      loading: "Enviando...",
    });
    form.reset();
    setRoleSelected("MEMBER");
  }

  useEffect(() => {
    const isShowModal = searchParams.get("modal") === "create-invite";

    if (isShowModal) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  return {
    onClose,
    showModal,
    setShowModal,
    form,
    onSubmit,
    roleSelected,
    setRoleSelected,
    isPending,
  };
}
