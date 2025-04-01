import { signUpAction } from "@/actions/auth/sign-up";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
    mode: "onBlur",
  });
  const { signUp } = useAuth();

  const values = form.getValues();
  const hasFormErrors = Object.keys(form.formState.errors).length > 0;
  const hasEmptyRequiredFields =
    !values.email?.trim() || !values.password?.trim() || !values.name?.trim();

  const isFormInvalid = hasEmptyRequiredFields || hasFormErrors;

  const { mutateAsync: signUpService, isPending } = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (data: SignUpFormValues) => signUpAction(data),
    onSuccess: (response) => {
      if (response.message) {
        toast.error(response.message);
        return;
      }

      toast.success("Sucesso! Verifique seu e-mail para ativar sua conta.");
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    await signUpService(data);
  }

  return {
    form,
    onSubmit,
    isPending,
    isFormInvalid,
  };
}
