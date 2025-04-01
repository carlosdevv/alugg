"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export async function signUpAction(body: z.infer<typeof signUpSchema>) {
  try {
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      throw new Error("Dados inválidos.");
    }

    const { email, password, name } = parsed.data;

    const hasUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (hasUser) {
      throw new Error("Não é possível criar um usuário com esse e-mail.");
    }

    const { user } = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return { data: user, message: null };
  } catch (error) {
    console.error("ERR:", error);

    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : "Ocorreu um erro, tente novamente mais tarde.";

    return {
      data: null,
      message: errorMessage,
    };
  }
}
