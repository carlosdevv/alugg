import { appRoutes } from "@/lib/constants";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInService, signUpService, validateEmailService } from ".";
import type {
  ErrorResponse,
  SignInServiceBody,
  SignUpServiceBody,
  ValidateEmailServiceBody,
} from "./types";

export function useSignInService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    SignInServiceBody
  >
) {
  return useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (body: SignInServiceBody) => await signInService(body),
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useSignUpService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    SignUpServiceBody
  >
) {
  const router = useRouter();

  return useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (body: SignUpServiceBody) => await signUpService(body),
    onSuccess: () => {
      router.push(appRoutes.signIn);
      toast.success("Usuário criado com sucesso.");
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useValidateEmailService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    ValidateEmailServiceBody
  >
) {
  return useMutation({
    mutationKey: ["validateEmail"],
    mutationFn: async (body: ValidateEmailServiceBody) =>
      await validateEmailService(body),
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}
