import { useSignInService } from "@/http/auth/use-auth-service";
import { appRoutes } from "@/lib/constants";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
  });

  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const { mutateAsync: signInService, isPending } = useSignInService({
    onSuccess: async () => {
      try {
        if (!signIn) {
          toast.error("CLK - Erro ao instanciar signIn.");
          return;
        }

        const signInAttempt = await signIn.create({
          identifier: form.getValues("email"),
          password: form.getValues("password"),
        });

        if (signInAttempt.status === "complete") {
          await setActive({ session: signInAttempt.createdSessionId });
          router.push(appRoutes.onboarding);
        } else {
          toast.error(
            "CLK - Ocorreu um erro ao realizar o login, tente novamente mais tarde."
          );
          return;
        }
      } catch (error) {
        toast.error(
          `CLK - Erro durante o login: ${error || "Erro desconhecido"}`
        );
      }
    },
  });

  async function onSubmit(data: SignInFormValues) {
    await signInService(data);
  }

  return { form, onSubmit, isPending };
}
