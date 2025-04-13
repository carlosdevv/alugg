import { useAuth } from "@/hooks/use-auth";
import { appRoutes } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function useForgotPasswordModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { forgetPassword } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const onClose = useCallback(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("modal");
    router.replace(`${pathname}?${nextSearchParams}`);
    setIsOpen(false);
  }, [pathname, router, searchParams]);

  const onSubmit = useCallback(async () => {
    setIsPending(true);

    try {
      const { error } = await forgetPassword({
        email,
        redirectTo: appRoutes.resetPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(
          "Se uma conta com este email existe, você receberá um e-mail com instruções para redefinir sua senha."
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Ocorreu um erro ao enviar o e-mail de redefinição de senha."
        );
      }
    } finally {
      setIsPending(false);
    }
  }, [email, forgetPassword]);

  useEffect(() => {
    const isShowModal =
      searchParams.get("modal") === "forgot-password" &&
      pathname.includes("auth");

    if (isShowModal) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [pathname, searchParams]);

  return { isOpen, setIsOpen, onClose, isPending, email, setEmail, onSubmit };
}
