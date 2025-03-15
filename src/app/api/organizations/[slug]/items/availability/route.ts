import { getUserMembership } from "@/actions/get-user-membership";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { parse } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const availabilityQuerySchema = z.object({
  eventDate: z.string().min(1, "Data do evento é obrigatória"),
  withdrawalDate: z.string().min(1, "Data de retirada é obrigatória"),
  returnDate: z.string().min(1, "Data de devolução é obrigatória"),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { slug } = params;
    const searchParams = req.nextUrl.searchParams;

    const eventDate = searchParams.get("eventDate");
    const withdrawalDate = searchParams.get("withdrawalDate");
    const returnDate = searchParams.get("returnDate");

    const validation = availabilityQuerySchema.safeParse({
      eventDate,
      withdrawalDate,
      returnDate,
    });

    if (!validation.success) {
      return NextResponse.json(
        { message: "Parâmetros inválidos", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { organization } = await getUserMembership(slug);

    // Converter datas do formato dd/MM/yyyy para objetos Date
    const parsedEventDate = parse(eventDate as string, "dd/MM/yyyy", new Date());
    const parsedWithdrawalDate = parse(withdrawalDate as string, "dd/MM/yyyy", new Date());
    const parsedReturnDate = parse(returnDate as string, "dd/MM/yyyy", new Date());

    // Buscar todos os itens da organização
    const items = await prisma.item.findMany({
      where: {
        organizationId: organization.id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Buscar contratos que se sobrepõem às datas solicitadas
    const overlappingContracts = await prisma.contract.findMany({
      where: {
        organizationId: organization.id,
        status: { notIn: ["CANCELLED"] },
        OR: [
          {
            // Contratos que começam durante o período solicitado
            eventDate: {
              gte: parsedWithdrawalDate,
              lte: parsedReturnDate,
            },
          },
          {
            // Contratos que terminam durante o período solicitado
            returnDate: {
              gte: parsedWithdrawalDate,
              lte: parsedReturnDate,
            },
          },
          {
            // Contratos que abrangem todo o período solicitado
            eventDate: { lte: parsedWithdrawalDate },
            returnDate: { gte: parsedReturnDate },
          },
        ],
      },
      include: {
        rentedItems: {
          include: {
            item: true,
          },
        },
      },
    });

    // Calcular a disponibilidade para cada item
    const itemsAvailability = items.map((item) => {
      // Verificar quantos deste item estão reservados durante o período
      const reservedQuantity = overlappingContracts.reduce(
        (total, contract) => {
          const rentedItem = contract.rentedItems.find(
            (ri) => ri.itemId === item.id
          );
          return total + (rentedItem ? rentedItem.quantity : 0);
        },
        0
      );

      // Calcular quantidade disponível
      const availableQuantity = Math.max(0, item.amount - reservedQuantity);

      // Obter datas de reserva para esse item (se não estiver totalmente disponível)
      const reservations = overlappingContracts
        .filter((contract) =>
          contract.rentedItems.some((ri) => ri.itemId === item.id)
        )
        .map((contract) => ({
          eventDate: contract.eventDate,
          withdrawalDate: contract.withdrawalDate,
          returnDate: contract.returnDate,
        }));

      return {
        ...item,
        availableQuantity,
        isAvailable: availableQuantity > 0,
        reservations: reservations.length > 0 ? reservations : null,
      };
    });

    console.log("BATIIIIIIIIII", itemsAvailability);

    return NextResponse.json({ data: itemsAvailability });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
