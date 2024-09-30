import {
  useSignUpService,
  useValidateEmailService,
} from "@/http/auth/use-auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signUpFormSchema = z.object({
  email: z.string({ required_error: "Email é obrigatório" }).email({
    message: "Email inválido",
  }),
  password: z.string({ required_error: "Senha é obrigatória" }).min(6, {
    message: "Senha deve ter ao menos 6 caracteres",
  }),
  name: z.string({ required_error: "Nome é obrigatório" }),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function useSignUpForm() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [verifyCodeScreen, setVerifyCodeScreen] = useState(false);
  const [code, setCode] = useState<string>();

  const { mutateAsync: signUp, isPending } = useSignUpService();

  const { mutateAsync: validateEmail, isPending: isSendingEmail } =
    useValidateEmailService({
      onSuccess: () => {
        toast.success("E-mail enviado! Verifique sua caixa de entrada.");
        setVerifyCodeScreen(true);
      },
    });

  async function onSubmit(data: SignUpFormValues) {
    const { password, ...props } = data;
    await validateEmail(props);
  }

  async function verifyCode() {
    if (!code) {
      toast.error("Por favor, informe o código de verificação.");
      return;
    }

    if (!form.getValues()) {
      setVerifyCodeScreen(false);
      return;
    }
    const props = {
      ...form.getValues(),
      code,
    };

    await signUp(props);
  }

  return {
    form,
    onSubmit,
    showPassword,
    setShowPassword,
    isPending,
    isSendingEmail,
    verifyCodeScreen,
    setVerifyCodeScreen,
    code,
    setCode,
    verifyCode,
  };
}
