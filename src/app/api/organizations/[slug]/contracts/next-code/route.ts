import { getUserMembership } from "@/actions/get-user-membership";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
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

    const { organization } = await getUserMembership(slug);

    const maxCodeResult = await prisma.contract.findFirst({
      where: {
        organizationId: organization.id,
      },
      orderBy: {
        code: "desc",
      },
      select: {
        code: true,
      },
    });

    const nextCode = maxCodeResult ? maxCodeResult.code + 1 : 1;

    return NextResponse.json({ data: { nextCode } });
  } catch (error) {
    console.error("[NEXT_CONTRACT_CODE_ERROR]", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar o próximo código de contrato." },
      { status: 500 }
    );
  }
}
