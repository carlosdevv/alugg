import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { PaymentMethod, type ContractStatus } from "@prisma/client";
import { compareDesc } from "date-fns";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/contracts - Get all contracts
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId();
    const { slug } = params;
    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get("status");

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

    const baseFilter = {
      organizationId: organization.id,
    };

    let statusFilter = {};
    if (statusParam) {
      const statusList = statusParam.toUpperCase().split(",");
      const validStatus = statusList.filter((s) =>
        ["OPEN", "CLOSED", "CANCELLED", "COLLECTED"].includes(s)
      ) as ContractStatus[];

      if (validStatus.length > 0) {
        statusFilter = {
          status: {
            in: validStatus,
          },
        };
      }
    }

    const whereFilter = { ...baseFilter, ...statusFilter };

    const [contracts, statusCounts] = await Promise.all([
      prisma.contract.findMany({
        where: whereFilter,
        select: {
          id: true,
          code: true,
          eventDate: true,
          withdrawalDate: true,
          returnDate: true,
          status: true,
          createdAt: true,
          totalValue: true,
          contractDocuments: {
            select: {
              url: true,
              type: true,
            },
          },
          customer: {
            select: {
              name: true,
              phone: true,
            },
          },
          payments: {
            select: {
              value: true,
              isPaid: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      // Conta os contratos por status
      prisma.$transaction([
        prisma.contract.count({
          where: baseFilter,
        }),
        prisma.contract.count({
          where: {
            ...baseFilter,
            status: "OPEN",
          },
        }),
        prisma.contract.count({
          where: {
            ...baseFilter,
            status: "CLOSED",
          },
        }),
        prisma.contract.count({
          where: {
            ...baseFilter,
            status: "CANCELLED",
          },
        }),
        prisma.contract.count({
          where: {
            ...baseFilter,
            status: "COLLECTED",
          },
        }),
      ]),
    ]);

    const formattedContracts = contracts.map((contract) => {
      const pendingDebt = contract.payments.reduce((total, payment) => {
        if (!payment.isPaid) {
          return total + payment.value;
        }
        return total;
      }, 0);

      return {
        id: contract.id,
        code: contract.code,
        customer: {
          name: contract.customer.name,
          phone: contract.customer.phone,
        },
        eventDate: contract.eventDate,
        withdrawalDate: contract.withdrawalDate,
        returnDate: contract.returnDate,
        status: contract.status,
        createdAt: contract.createdAt,
        totalValue: contract.totalValue,
        pendingDebt,
        contractDocuments: contract.contractDocuments,
      };
    });

    const count = {
      total: statusCounts[0],
      open: statusCounts[1],
      closed: statusCounts[2],
      cancelled: statusCounts[3],
      collected: statusCounts[4],
    };

    if (formattedContracts.length === 0) {
      return NextResponse.json({ data: [], count }, { status: 200 });
    }

    return NextResponse.json(
      {
        data: formattedContracts,
        count,
      },
      { status: 200 }
    );
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
    code: z.number().optional(),
    totalValue: z.number(),
    customerId: z.string({ required_error: "Cliente é obrigatório" }),
    eventDate: z.string({ required_error: "Data do evento é obrigatória" }),
    withdrawalDate: z.string({
      required_error: "Data de retirada é obrigatória",
    }),
    returnDate: z.string({ required_error: "Data de devolução é obrigatória" }),
    memberId: z.string({ required_error: "Membro é obrigatório" }),
    additionalInformation: z.string().optional(),
    contractUrl: z.string(),
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
    const userId = await getUserId();
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

    const eventDate = parseDate(contractData.eventDate);
    const withdrawalDate = parseDate(contractData.withdrawalDate);
    const returnDate = parseDate(contractData.returnDate);

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
        code: contractData.code,
        eventDate: eventDate,
        withdrawalDate: withdrawalDate,
        returnDate: returnDate,
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
            paymentDate: parseDate(payment.paymentDate),
            isPaid: payment.isPaid,
            method: payment.method,
            creditParcelAmount: payment.creditParcelAmount,
          })),
        },
        contractDocuments: {
          create: {
            url: contractData.contractUrl,
            type: "INVOICE",
          },
        },
        organizationId: organization.id,
      },
      include: {
        rentedItems: true,
        payments: true,
        contractDocuments: {
          select: {
            url: true,
            type: true,
          },
        },
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
  withdrawalDateStr: string,
  returnDateStr: string,
  organizationId: string
): Promise<boolean> {
  const withdrawalDate = parseDate(withdrawalDateStr);
  const returnDate = parseDate(returnDateStr);

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
          withdrawalDate: { lte: returnDate },
          returnDate: { gte: withdrawalDate },
        },
        {
          // Contratos que começam durante o período solicitado
          withdrawalDate: {
            gte: withdrawalDate,
            lte: returnDate,
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

const parseDate = (dateString: string): Date => {
  if (dateString.includes("-")) {
    return new Date(dateString);
  }

  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};
