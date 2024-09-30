import { useSignUpService } from "@/http/auth/use-auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpFormSchema = z.object({
  email: z.string({ required_error: "Email é obrigatório" }).email({
    message: "Email inválido",
  }),
  password: z.string({ required_error: "Senha é obrigatória" }).min(8, {
    message: "Senha deve ter ao menos 8 caracteres",
  }),
  name: z.string({ required_error: "Nome é obrigatório" }),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function useSignUpForm() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: signUp, isPending } = useSignUpService();

  async function onSubmit(data: SignUpFormValues) {
    await signUp(data);
  }

  return { form, onSubmit, showPassword, setShowPassword, isPending };
}
