import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { toast } from "sonner";
import { signUpService } from ".";
import type { SignUpServiceBody } from "./types";

export function useSignUpService(
  options?: UseMutationOptions<void, HTTPError, SignUpServiceBody>
) {
  return useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (body: SignUpServiceBody) => await signUpService(body),
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
}
