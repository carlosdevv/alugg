"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signInAction(body: z.infer<typeof signInSchema>) {
  try {
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        message: "Credenciais inválidas.",
      };
    }

    const { email, password } = parsed.data;

    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        data: null,
        message: mapErrorResponses(errorData.message),
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data.user,
      message: null,
    };
  } catch (error) {
    console.error("ERR:", error);
    return {
      success: false,
      data: null,
      message: "Ocorreu um erro, tente novamente mais tarde.",
    };
  }
}

const mapErrorResponses = (message: string) => {
  const errorMessages: Record<string, string> = {
    "Email not verified":
      "Por favor, verifique seu e-mail para ativar sua conta.",
    "Invalid email or password": "Email ou senha inválidos.",
    "User not found": "Email ou senha inválidos.",
  };

  return (
    errorMessages[message] || "Ocorreu um erro, tente novamente mais tarde."
  );
};
