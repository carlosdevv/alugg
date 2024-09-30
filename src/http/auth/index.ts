import { api } from "../api-client";
import type { SignUpServiceBody } from "./types";

export async function signUpService({
  name,
  email,
  password,
}: SignUpServiceBody): Promise<void> {
  await api.post("api/auth/sign-up", {
    json: {
      name,
      email,
      password,
    },
  });
}
