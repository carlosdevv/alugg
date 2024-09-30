import { api } from "../api-client";
import type {
  SignInServiceBody,
  SignUpServiceBody,
  ValidateEmailServiceBody,
} from "./types";

export async function signInService({
  email,
  password,
}: SignInServiceBody): Promise<void> {
  await api.post("api/auth/sign-in", {
    json: {
      email,
      password,
    },
  });
}

export async function signUpService({
  name,
  email,
  password,
  code,
}: SignUpServiceBody): Promise<void> {
  await api.post("api/auth/sign-up", {
    json: {
      name,
      email,
      password,
      code,
    },
  });
}

export async function validateEmailService({
  name,
  email,
}: ValidateEmailServiceBody): Promise<void> {
  await api.post("api/auth/validate-email", {
    json: {
      name,
      email,
    },
  });
}
