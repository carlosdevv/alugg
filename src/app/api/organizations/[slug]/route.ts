import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    const { slug } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { message: "É necessário informar o ID da Organização." },
        { status: 400 }
      );
    }

    const member = await prisma.member.findFirst({
      where: {
        userId,
        organization: {
          slug,
        },
      },
      include: {
        organization: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Usuário não encontrado nesta organização." },
        { status: 401 }
      );
    }

    const { organization } = member;

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
