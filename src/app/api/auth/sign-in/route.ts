import prisma from "@/lib/prismadb";
import { compare } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// POST /api/auth/sign-in - Sign in
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const { email, password } = parsed.data;

    const hasUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!hasUser) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const isPasswordValid = compare(password, hasUser.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
