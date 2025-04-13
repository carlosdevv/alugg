import { useAuth } from "@/hooks/use-auth";
import { appRoutes } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "A senha deve ter ao menos 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "A senha deve ter ao menos 6 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export default function useResetPassword() {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorParam, setErrorParam] = useState<string | null>(null);

  const redirectToLogin = useCallback(() => {
    router.push(appRoutes.signIn);
  }, [router]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof resetPasswordSchema>) => {
      if (!searchParams.get("token")) {
        toast.error("Token não encontrado");
        setIsPending(false);
        return;
      }

      setIsPending(true);

      const { error } = await resetPassword({
        newPassword: data.password,
        token: searchParams.get("token") as string,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Senha redefinida com sucesso");
        redirectToLogin();
      }

      setIsPending(false);
    },
    [resetPassword, redirectToLogin, searchParams]
  );

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      setErrorParam(error);
    }
  }, [searchParams]);

  return {
    form,
    onSubmit,
    isPending,
    errorParam,
    redirectToLogin,
  };
}
