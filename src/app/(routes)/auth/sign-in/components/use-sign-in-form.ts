import { signInAction } from "@/actions/auth/sign-in";
import { appRoutes } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signInFormSchema = z.object({
  email: z.string({ required_error: "Email é obrigatório" }).email({
    message: "Email inválido",
  }),
  password: z.string({ required_error: "Senha é obrigatória" }).min(6, {
    message: "Senha deve ter ao menos 6 caracteres",
  }),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

export default function useSignInForm() {
  const router = useRouter();

  const [, setModal] = useQueryState("modal");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
  });

  const { mutateAsync: signInService, isPending } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (data: SignInFormValues) => signInAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Login realizado com sucesso!");
        router.push(appRoutes.onboarding);
      } else {
        toast.error(response.message || "Falha na autenticação");
      }
    },
    onError: (error) => {
      console.error("Erro na autenticação:", error);
      toast.error(
        "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde."
      );
    },
  });

  async function onSubmit(data: SignInFormValues) {
    await signInService(data);
  }

  return { form, onSubmit, isPending, setModal };
}
