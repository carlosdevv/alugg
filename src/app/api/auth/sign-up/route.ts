import prisma from "@/lib/prismadb";
import { clerkClient } from "@clerk/nextjs/server";
import { hash } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  code: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos." },
        { status: 400 }
      );
    }

    const { email, password, name, code } = parsed.data;

    const hasUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (hasUser) {
      return NextResponse.json(
        { message: "Já existe um usuário com o esse e-mail." },
        { status: 400 }
      );
    }

    const token = await prisma.token.findFirst({
      where: {
        type: "EMAIL_VALIDATION",
        email,
        code,
      },
    });

    if (!token) {
      return NextResponse.json(
        { message: "Código de verificação inválido." },
        { status: 400 }
      );
    }

    const EXPIRED_TIME_MS = 15 * 1000 * 60;
    const tokenExpired =
      Date.now() - new Date(token.createdAt).getTime() >= EXPIRED_TIME_MS;

    if (tokenExpired) {
      return NextResponse.json(
        { message: "Código de verificação expirado." },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 6);

    const clerkUser = await clerkClient().users.createUser({
      emailAddress: [email],
      firstName: name,
      password: password,
      skipPasswordChecks: true,
    });

    if (!clerkUser) {
      return NextResponse.json(
        { message: "CLK - Erro ao criar usuário." },
        { status: 500 }
      );
    }

    Promise.all([
      await prisma.token.deleteMany({
        where: {
          type: "EMAIL_VALIDATION",
          email,
        },
      }),
      await prisma.user.create({
        data: {
          id: clerkUser.id,
          email,
          passwordHash,
          name,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Usuário criado com sucesso." },
      { status: 201 }
    );
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
