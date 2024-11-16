import prisma from "@/lib/prismadb";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const validateEmailSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

// POST /api/auth/validate-email - Validate email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = validateEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos." },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;

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

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const token = await prisma.token.create({
      data: {
        type: "EMAIL_VALIDATION",
        email,
        code: verificationCode,
      },
    });

    if (!token) {
      return NextResponse.json(
        { message: "Ocorreu um erro ao validar o email." },
        { status: 400 }
      );
    }

    const fromEmail = process.env.RESEND_EMAIL;

    const resend = new Resend(process.env.RESEND_KEY);

    await resend.emails.send({
      from: `Alugg | Código de verificação <${fromEmail}>`,
      to: email,
      subject: `${verificationCode} é seu código de verificação | Alugg`,
      text: `Olá ${name}, insira esse código no campo de verificação para continuar o cadastro: ${verificationCode}`,
    });

    return NextResponse.json(
      { message: "E-mail enviado com sucesso." },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
