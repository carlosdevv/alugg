import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInFormSchema = z.object({
  email: z.string({ required_error: "Email é obrigatório" }).email({
    message: "Email inválido",
  }),
  password: z.string({ required_error: "Senha é obrigatória" }).min(8, {
    message: "Senha deve ter ao menos 8 caracteres",
  }),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

export default function useSignIn() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(data: SignInFormValues) {
    console.log(data);
  }

  return { form, onSubmit, showPassword, setShowPassword };
}
