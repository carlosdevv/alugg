import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// TODO: Implementar a rota para atualizar o contrato
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; contractId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const { slug, contractId } = params;

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

    if (cannot("get", "Contract")) {
      return NextResponse.json(
        { message: "Você não tem permissão para visualizar contratos." },
        { status: 403 }
      );
    }

    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId,
      },
      include: {
        rentedItems: true,
        payments: true,
        contractDocuments: true,
        customer: true,
        seller: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { message: "Contrato não encontrado." },
        { status: 404 }
      );
    }

    const seller = await prisma.user.findUnique({
      where: {
        id: contract.sellerId,
      },
      select: {
        name: true,
      },
    });

    const formattedContract = {
      ...contract,
      id: contract.id,
      code: contract.code,
      eventDate: contract.eventDate,
      withdrawalDate: contract.withdrawalDate,
      returnDate: contract.returnDate,
      totalValue: contract.totalValue,
      status: contract.status,
      additionalInformation: contract.additionalInformation,
      seller: {
        name: seller?.name,
        role: contract.seller.role,
      },
    };

    return NextResponse.json({ data: formattedContract }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Usuário não encontrado." },
      { status: 404 }
    );
  }
}

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
