import { getUserMembership } from "@/actions/get-user-membership";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

// GET /api/organizations/:slug/items/:itemId/history
// Busca o histórico de alugueis do item
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; itemId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, itemId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (!slug || !itemId) {
      return NextResponse.json(
        { message: "Parâmetros inválidos." },
        { status: 400 }
      );
    }

    const { organization } = await getUserMembership(slug);

    // Verificar se o item pertence à organização
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        organizationId: organization.id,
      },
    });

    if (!item) {
      return NextResponse.json(
        { message: "Item não encontrado nesta organização." },
        { status: 404 }
      );
    }

    // Buscar o histórico de contratos para este item (simplificado)
    const contractHistory = await prisma.contractItem.findMany({
      where: {
        itemId,
        contract: {
          organizationId: organization.id,
        },
      },
      include: {
        contract: {
          select: {
            id: true,
            code: true,
            eventDate: true,
            withdrawalDate: true,
            returnDate: true,
            totalValue: true,
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        contract: {
          eventDate: "desc",
        },
      },
    });

    // Formatar os dados para retornar apenas o necessário
    const formattedHistory = contractHistory.map((item) => ({
      contractId: item.contract?.id,
      code: item.contract?.code,
      customerName: item.contract?.customer?.name,
      eventDate: item.contract?.eventDate,
      withdrawalDate: item.contract?.withdrawalDate,
      returnDate: item.contract?.returnDate,
      totalValue: item.contract?.totalValue,
      quantity: item.quantity,
    }));

    return NextResponse.json(
      {
        data: {
          item: {
            id: item.id,
            name: item.name,
            amount: item.amount,
          },
          contractHistory: formattedHistory,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar histórico do item:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao buscar o histórico do item." },
      { status: 500 }
    );
  }
}
