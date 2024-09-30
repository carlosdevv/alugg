import { appRoutes } from "@/lib/constants";
import prisma from "@/lib/prismadb";
import { useSignIn } from "@clerk/nextjs";
import { compare } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const { signIn, setActive } = useSignIn();
  try {
    const body = await req.json();
    const { email, password } = signInSchema.parse(body);

    const hasUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!email || !password) {
      return new NextResponse("Credenciais inválidas.", {
        status: 400,
      });
    }

    if (!hasUser) {
      return new NextResponse("Credenciais inválidas.", {
        status: 400,
      });
    }

    const isPasswordValid = compare(password, hasUser.passwordHash as string);

    if (!isPasswordValid) {
      return new NextResponse("Credenciais inválidas.", {
        status: 400,
      });
    }

    if (!signIn)
      throw new Error("CLK - Ocorreu um erro, tente novamente mais tarde.");

    const signInAttempt = await signIn.create({
      identifier: email,
      password,
    });

    if (signInAttempt.status === "complete") {
      await setActive({ session: signInAttempt.createdSessionId });
      return NextResponse.redirect(appRoutes.home);
    } else {
      console.error(JSON.stringify(signInAttempt, null, 2));
      throw new Error("CLK - Ocorreu um erro, tente novamente mais tarde.");
    }
  } catch (error) {
    console.log("ERR:", error);
    return new NextResponse(error as string, { status: 500 });
  }
}
