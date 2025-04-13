import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import prisma from "@/lib/prismadb";
import { addDays, parse, subDays } from "date-fns";
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
    const userId = await getUserId();

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
    const parsedEventDate = parse(
      eventDate as string,
      "dd/MM/yyyy",
      new Date()
    );
    const parsedWithdrawalDate = parse(
      withdrawalDate as string,
      "dd/MM/yyyy",
      new Date()
    );
    const parsedReturnDate = parse(
      returnDate as string,
      "dd/MM/yyyy",
      new Date()
    );

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

    // Aplicar os dias extras de reserva configurados na organização
    const adjustedWithdrawalDate = subDays(
      parsedWithdrawalDate,
      organization.contractDaysBefore
    );
    const adjustedReturnDate = addDays(
      parsedReturnDate,
      organization.contractDaysAfter
    );

    // Buscar contratos que se sobrepõem às datas solicitadas (considerando os dias extras)
    const overlappingContracts = await prisma.contract.findMany({
      where: {
        organizationId: organization.id,
        status: { notIn: ["CANCELLED"] },
        OR: [
          {
            // Contratos que começam durante o período solicitado (ajustado)
            withdrawalDate: {
              lte: adjustedReturnDate,
            },
            returnDate: {
              gte: adjustedWithdrawalDate,
            },
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
          // Para cada contrato sobreposto, aplicar os dias extras de reserva
          const contractWithdrawalDate = subDays(
            contract.withdrawalDate,
            organization.contractDaysBefore
          );
          const contractReturnDate = addDays(
            contract.returnDate,
            organization.contractDaysAfter
          );

          // Verificar se há sobreposição com o período solicitado (já ajustado)
          const hasOverlap =
            contractWithdrawalDate <= adjustedReturnDate &&
            contractReturnDate >= adjustedWithdrawalDate;

          if (hasOverlap) {
            const rentedItem = contract.rentedItems.find(
              (ri) => ri.itemId === item.id
            );
            return total + (rentedItem ? rentedItem.quantity : 0);
          }
          return total;
        },
        0
      );

      // Calcular quantidade disponível
      const availableQuantity = Math.max(0, item.amount - reservedQuantity);

      // Obter datas de reserva para esse item (se não estiver totalmente disponível)
      const reservations = overlappingContracts
        .filter((contract) => {
          // Aplicar os dias extras para cada contrato
          const contractWithdrawalDate = subDays(
            contract.withdrawalDate,
            organization.contractDaysBefore
          );
          const contractReturnDate = addDays(
            contract.returnDate,
            organization.contractDaysAfter
          );

          // Verificar sobreposição
          const hasOverlap =
            contractWithdrawalDate <= adjustedReturnDate &&
            contractReturnDate >= adjustedWithdrawalDate;

          return (
            hasOverlap &&
            contract.rentedItems.some((ri) => ri.itemId === item.id)
          );
        })
        .map((contract) => ({
          eventDate: contract.eventDate,
          withdrawalDate: contract.withdrawalDate,
          returnDate: contract.returnDate,
          // Adicionar as datas ajustadas para melhor visualização
          adjustedWithdrawalDate: subDays(
            contract.withdrawalDate,
            organization.contractDaysBefore
          ),
          adjustedReturnDate: addDays(
            contract.returnDate,
            organization.contractDaysAfter
          ),
        }));

      return {
        ...item,
        availableQuantity,
        isAvailable: availableQuantity > 0,
        reservations: reservations.length > 0 ? reservations : null,
        // Adicionar as datas ajustadas da consulta atual para referência
        requestedPeriod: {
          eventDate: parsedEventDate,
          withdrawalDate: parsedWithdrawalDate,
          returnDate: parsedReturnDate,
          adjustedWithdrawalDate,
          adjustedReturnDate,
        },
      };
    });

    return NextResponse.json({ data: itemsAvailability });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
