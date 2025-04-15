import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import prisma from "@/lib/prismadb";
import { ContractStatus, ItemStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const userId = await getUserId();
    const { slug } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const { organization } = await getUserMembership(slug);

    // Consulta eficiente usando contagem
    const finishedContractsCount = await prisma.contract.count({
      where: {
        organizationId: organization.id,
        status: ContractStatus.CLOSED,
      },
    });

    // Total de contratos
    const totalContractsCount = await prisma.contract.count({
      where: {
        organizationId: organization.id,
      },
    });

    // Itens disponíveis em estoque (amount > 0)
    const stockItemsCount = await prisma.item.count({
      where: {
        organizationId: organization.id,
        amount: {
          gt: 0,
        },
        status: ItemStatus.ACTIVE,
      },
    });

    // Total de itens
    const totalItemsCount = await prisma.item.count({
      where: {
        organizationId: organization.id,
      },
    });

    // Total de clientes
    const customersCount = await prisma.customer.count({
      where: {
        organizationId: organization.id,
      },
    });

    return NextResponse.json({
      finishedContracts: finishedContractsCount,
      totalContracts: totalContractsCount,
      totalItems: totalItemsCount,
      clients: customersCount,
      stockItems: stockItemsCount,
    });
  } catch (error) {
    console.error("[ORGANIZATION_STATS_GET]", error);
    return NextResponse.json(
      { message: "Erro ao buscar estatísticas da organização" },
      { status: 500 }
    );
  }
}
