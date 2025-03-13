import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; contractId: string } }
) {
  const { userId } = auth();
  const { slug, contractId } = params;

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

  if (!contractId) {
    return NextResponse.json(
      { message: "É necessário informar o ID do Contrato." },
      { status: 400 }
    );
  }

  const { membership } = await getUserMembership(slug);

  const { cannot } = getUserPermissions(userId, membership.role);

  if (cannot("delete", "Contract")) {
    return NextResponse.json(
      { message: "Você não tem permissão para deletar contratos." },
      { status: 403 }
    );
  }

  const contract = await prisma.contract.delete({
    where: {
      id: contractId,
    },
  });

  return NextResponse.json(contract, { status: 200 });
}
