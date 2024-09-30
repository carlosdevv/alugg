import { appRoutes } from "@/lib/constants";
import prisma from "@/lib/prismadb";
import { clerkClient } from "@clerk/nextjs/server";
import { hash } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, name } = signUpSchema.parse(body);

    const hasUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (hasUser) {
      return new NextResponse("Já existe um usuário com o esse e-mail.", {
        status: 400,
      });
    }

    const passwordHash = await hash(password, 6);

    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: name,
      password: passwordHash,
    });

    if (!clerkUser) {
      return new NextResponse("CLK - Erro ao criar usuário.", { status: 500 });
    }

    await prisma.user.create({
      data: {
        id: clerkUser.id,
        email,
        passwordHash,
        name,
      },
    });

    return NextResponse.redirect(appRoutes.signIn);
  } catch (error) {
    console.log("ERR:", error);
    return new NextResponse("Ocorreu um erro, tente novamente mais tarde.", {
      status: 500,
    });
  }
}
