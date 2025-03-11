import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { compareDesc } from "date-fns";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/contracts - Get all contracts
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

    const { organization } = await getUserMembership(slug);

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where: {
          organizationId: organization.id,
        },
      }),
      prisma.contract.count({
        where: {
          organizationId: organization.id,
        },
      }),
    ]);

    if (total === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    return NextResponse.json({ data: contracts, total }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

// POST /api/organizations/:slug/contracts - Create a new contract
const createContractSchema = z
  .object({
    totalValue: z.number(),
    customerId: z.string({ required_error: "Cliente é obrigatório" }),
    eventDate: z.string({ required_error: "Data do evento é obrigatória" }),
    withdrawalDate: z.string({
      required_error: "Data de retirada é obrigatória",
    }),
    returnDate: z.string({ required_error: "Data de devolução é obrigatória" }),
    memberId: z.string({ required_error: "Membro é obrigatório" }),
    additionalInformation: z.string().optional(),
    items: z.array(
      z.object({
        itemId: z.string(),
        quantity: z.number(),
        isBonus: z.boolean().default(false),
        discount: z.number().default(0),
        finalValue: z.number(),
      })
    ),
    paymentMethod: z.array(
      z.object({
        method: z.nativeEnum(PaymentMethod, {
          required_error: "Método de pagamento é obrigatório",
        }),
        value: z.number(),
        creditParcelAmount: z.number({
          required_error: "Parcelas são obrigatórias",
        }),
        paymentDate: z.string({
          required_error: "Data de pagamento é obrigatória",
        }),
        isPaid: z.boolean({
          required_error: "Status de pagamento é obrigatório",
        }),
      })
    ),
  })
  .superRefine((data, ctx) => {
    if (
      compareDesc(new Date(data.withdrawalDate), new Date(data.eventDate)) ===
      -1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data de retirada deve ser antes da data do evento",
        path: ["withdrawalDate"],
      });
    }

    if (
      compareDesc(new Date(data.returnDate), new Date(data.eventDate)) === 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data do devolução deve ser depois da data do evento",
        path: ["returnDate"],
      });
    }
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
    const parsed = createContractSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

    const { ...contractData } = parsed.data;
    const { membership, organization } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("create", "Contract")) {
      return NextResponse.json(
        { message: "Você não tem permissão para criar um contrato." },
        { status: 403 }
      );
    }

    // Verificar disponibilidade dos itens
    for (const item of contractData.items) {
      const isAvailable = await checkItemAvailability(
        item.itemId,
        item.quantity,
        contractData.withdrawalDate,
        contractData.returnDate,
        organization.id
      );

      if (!isAvailable) {
        const itemDetails = await prisma.item.findUnique({
          where: { id: item.itemId },
          select: { name: true },
        });

        return NextResponse.json(
          {
            message: `Item "${
              itemDetails?.name || item.itemId
            }" não está disponível na quantidade solicitada para o período selecionado.`,
          },
          { status: 400 }
        );
      }
    }

    const contract = await prisma.contract.create({
      data: {
        eventDate: new Date(contractData.eventDate),
        withdrawalDate: new Date(contractData.withdrawalDate),
        returnDate: new Date(contractData.returnDate),
        totalValue: contractData.totalValue,
        sellerId: contractData.memberId,
        customerId: contractData.customerId,
        additionalInformation: contractData.additionalInformation,
        rentedItems: {
          create: contractData.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            isBonus: item.isBonus,
            discount: item.discount,
            value: item.finalValue,
          })),
        },
        payments: {
          create: contractData.paymentMethod.map((payment) => ({
            value: payment.value,
            paymentDate: new Date(payment.paymentDate),
            isPaid: payment.isPaid,
            method: payment.method,
            creditParcelAmount: payment.creditParcelAmount,
          })),
        },
        organizationId: organization.id,
      },
      include: {
        rentedItems: true,
        payments: true,
      },
    });

    return NextResponse.json({ data: contract }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar contrato:", error);
    return NextResponse.json(
      {
        message:
          "Ocorreu um erro ao criar o contrato. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}

// Função para verificar disponibilidade de itens
async function checkItemAvailability(
  itemId: string,
  requestedQuantity: number,
  withdrawalDate: string,
  returnDate: string,
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
          withdrawalDate: { lte: new Date(returnDate) },
          returnDate: { gte: new Date(withdrawalDate) },
        },
        {
          // Contratos que começam durante o período solicitado
          withdrawalDate: {
            gte: new Date(withdrawalDate),
            lte: new Date(returnDate),
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
    return (
      total +
      contract.rentedItems.reduce(
        (sum, rentedItem) => sum + rentedItem.quantity,
        0
      )
    );
  }, 0);

  // Verificar se há quantidade suficiente disponível
  return item.amount - reservedQuantity >= requestedQuantity;
}
