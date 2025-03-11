import { getUserMembership } from "@/actions/get-user-membership";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const checkAvailabilitySchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string(),
      quantity: z.number().positive(),
    })
  ),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export async function POST(
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

    const body = await req.json();
    const parsed = checkAvailabilitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos para verificação de disponibilidade." },
        { status: 400 }
      );
    }

    const { items, startDate, endDate } = parsed.data;
    const { organization } = await getUserMembership(slug);

    const availabilityResults = await Promise.all(
      items.map(async (item) => {
        const isAvailable = await checkItemAvailability(
          item.itemId,
          item.quantity,
          startDate,
          endDate,
          organization.id
        );

        const itemDetails = await prisma.item.findUnique({
          where: { id: item.itemId },
          select: { name: true, amount: true },
        });

        return {
          itemId: item.itemId,
          name: itemDetails?.name || "Item desconhecido",
          requestedQuantity: item.quantity,
          totalQuantity: itemDetails?.amount || 0,
          isAvailable,
        };
      })
    );

    const allAvailable = availabilityResults.every((result) => result.isAvailable);

    return NextResponse.json({
      allAvailable,
      items: availabilityResults,
    }, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao verificar a disponibilidade dos itens." },
      { status: 500 }
    );
  }
}

async function checkItemAvailability(
  itemId: string,
  requestedQuantity: number,
  startDate: string,
  endDate: string,
  organizationId: string
): Promise<boolean> {
  // Buscar o item para verificar a quantidade total disponível
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { amount: true },
  });

  if (!item) return false;

  // Buscar todos os contratos ativos que se sobrepõem ao período solicitado
  const overlappingContracts = await prisma.contract.findMany({
    where: {
      organizationId,
      status: { not: "CANCELLED" },
      OR: [
        {
          // Contratos que começam antes e terminam durante o período solicitado
          withdrawalDate: { lte: new Date(endDate) },
          returnDate: { gte: new Date(startDate) },
        },
        {
          // Contratos que começam durante o período solicitado
          withdrawalDate: { 
            gte: new Date(startDate),
            lte: new Date(endDate) 
          },
        },
      ],
    },
    include: {
      rentedItems: {
        where: { itemId },
      },
    },
  });

  // Calcular a quantidade total já reservada para o período
  const reservedQuantity = overlappingContracts.reduce((total, contract) => {
    return total + contract.rentedItems.reduce((sum, rentedItem) => sum + rentedItem.quantity, 0);
  }, 0);

  // Verificar se há quantidade suficiente disponível
  return item.amount - reservedQuantity >= requestedQuantity;
} 