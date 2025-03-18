import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { compareDesc } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Adicionar a função parseDate
const parseDate = (dateString: string): Date => {
  if (dateString.includes("-")) {
    return new Date(dateString);
  }

  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// GET /api/organizations/:slug/contracts/:contractId - Get a contract by ID
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

    // Buscar apenas os dados necessários do contrato
    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId,
      },
      select: {
        id: true,
        code: true,
        eventDate: true,
        withdrawalDate: true,
        returnDate: true,
        totalValue: true,
        status: true,
        additionalInformation: true,
        sellerId: true,
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        rentedItems: {
          select: {
            id: true,
            itemId: true,
            quantity: true,
            isBonus: true,
            discount: true,
            value: true,
            item: {
              select: {
                name: true,
                rentPrice: true,
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            method: true,
            value: true,
            creditParcelAmount: true,
            paymentDate: true,
            isPaid: true,
          },
        },
        contractDocuments: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
        seller: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { message: "Contrato não encontrado." },
        { status: 404 }
      );
    }

    // Buscar o nome do vendedor
    const seller = await prisma.user.findUnique({
      where: {
        id: contract.sellerId,
      },
      select: {
        name: true,
      },
    });

    // Calcular o valor pendente
    const totalPaid = contract.payments.reduce((acc, payment) => {
      return payment.isPaid ? acc + payment.value : acc;
    }, 0);

    const pendingDebt = contract.totalValue - totalPaid;

    const formattedContract = {
      ...contract,
      pendingDebt,
      rentedItems: contract.rentedItems.map((item) => ({
        ...item,
        finalValue: item.value,
        item: {
          ...item.item,
          price: item.item.rentPrice,
        },
      })),
      seller: {
        name: seller?.name || null,
        role: contract.seller.role,
      },
    };

    return NextResponse.json({ data: formattedContract }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar contrato." },
      { status: 500 }
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

// PUT /api/organizations/:slug/contracts/:contractId - Update a contract
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string; contractId: string } }
) {
  try {
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

    const { membership, organization } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("update", "Contract")) {
      return NextResponse.json(
        { message: "Você não tem permissão para atualizar contratos." },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Usar o mesmo schema de validação da criação, mas tornando alguns campos opcionais
    const updateContractSchema = z
      .object({
        totalValue: z.number().optional(),
        customerId: z.string().optional(),
        eventDate: z.string(),
        withdrawalDate: z.string(),
        returnDate: z.string(),
        memberId: z.string().optional(),
        additionalInformation: z.string().optional(),
        contractUrl: z.string().optional(),
        items: z
          .array(
            z.object({
              id: z.string().optional(), // ID do item alugado (para atualização)
              itemId: z.string(),
              quantity: z.number(),
              isBonus: z.boolean().default(false),
              discount: z.number().default(0),
              finalValue: z.number(),
            })
          )
          .optional(),
        payments: z.array(
          z.object({
            id: z.string().optional(), // ID do pagamento (para atualização)
            method: z.nativeEnum(PaymentMethod),
            value: z.number(),
            creditParcelAmount: z.number(),
            paymentDate: z.string(),
            isPaid: z.boolean(),
          })
        ),
      })
      .superRefine((data, ctx) => {
        if (
          compareDesc(
            new Date(data.withdrawalDate),
            new Date(data.eventDate)
          ) === -1
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

    const parsed = updateContractSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas.", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      eventDate,
      withdrawalDate,
      returnDate,
      additionalInformation,
      payments,
      contractUrl,
      items,
      customerId,
      memberId,
      totalValue,
    } = parsed.data;

    // Verificar se o contrato existe
    const existingContract = await prisma.contract.findUnique({
      where: {
        id: contractId,
      },
      include: {
        rentedItems: true,
      },
    });

    if (!existingContract) {
      return NextResponse.json(
        { message: "Contrato não encontrado." },
        { status: 404 }
      );
    }

    // Verificar disponibilidade dos itens se houver novos itens
    if (items && items.length > 0) {
      for (const item of items) {
        // Verificar apenas itens novos ou com quantidade aumentada
        const existingItem = existingContract.rentedItems.find(
          (ri) => ri.itemId === item.itemId
        );

        const quantityDiff = existingItem
          ? item.quantity - existingItem.quantity
          : item.quantity;

        if (quantityDiff > 0) {
          const isAvailable = await checkItemAvailability(
            item.itemId,
            quantityDiff,
            withdrawalDate,
            returnDate,
            organization.id,
            contractId // Excluir o contrato atual da verificação
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
      }
    }

    // Iniciar uma transação para garantir a integridade dos dados
    const updatedContract = await prisma.$transaction(async (tx) => {
      // 1. Atualizar o contrato
      const contract = await tx.contract.update({
        where: {
          id: contractId,
        },
        data: {
          eventDate: eventDate ? new Date(eventDate) : undefined,
          withdrawalDate: withdrawalDate ? new Date(withdrawalDate) : undefined,
          returnDate: returnDate ? new Date(returnDate) : undefined,
          additionalInformation,
          customerId: customerId || undefined,
          sellerId: memberId || undefined,
          totalValue: totalValue || undefined,
        },
        select: {
          id: true,
          code: true,
        },
      });

      // 2. Atualizar os itens alugados se fornecidos
      if (items && items.length > 0) {
        // Identificar itens a manter
        const rentedItemIds = items
          .filter((i) => i.id)
          .map((i) => i.id as string);

        // Remover itens que não estão mais presentes
        await tx.contractItem.deleteMany({
          where: {
            contractId,
            id: {
              notIn: rentedItemIds,
            },
          },
        });

        // Atualizar ou criar itens
        for (const item of items) {
          if (item.id) {
            // Atualizar item existente
            await tx.contractItem.update({
              where: {
                id: item.id,
              },
              data: {
                quantity: item.quantity,
                isBonus: item.isBonus,
                discount: item.discount,
                value: item.finalValue,
              },
            });
          } else {
            // Criar novo item
            await tx.contractItem.create({
              data: {
                contractId,
                itemId: item.itemId,
                quantity: item.quantity,
                isBonus: item.isBonus,
                discount: item.discount,
                value: item.finalValue,
              },
            });
          }
        }
      }

      // 3. Atualizar os pagamentos
      if (payments && payments.length > 0) {
        // Identificar pagamentos a manter
        const paymentIds = payments
          .filter((p) => p.id)
          .map((p) => p.id as string);

        // Remover pagamentos que não estão mais presentes
        await tx.contractPayment.deleteMany({
          where: {
            contractId,
            id: {
              notIn: paymentIds,
            },
          },
        });

        // Atualizar ou criar pagamentos
        for (const payment of payments) {
          if (payment.id) {
            // Atualizar pagamento existente
            await tx.contractPayment.update({
              where: {
                id: payment.id,
              },
              data: {
                method: payment.method,
                value: payment.value,
                creditParcelAmount: payment.creditParcelAmount,
                paymentDate: new Date(payment.paymentDate),
                isPaid: payment.isPaid,
              },
            });
          } else {
            // Criar novo pagamento
            await tx.contractPayment.create({
              data: {
                contractId,
                method: payment.method,
                value: payment.value,
                creditParcelAmount: payment.creditParcelAmount,
                paymentDate: new Date(payment.paymentDate),
                isPaid: payment.isPaid,
              },
            });
          }
        }
      }

      // 4. Adicionar documento do contrato se fornecido
      if (contractUrl) {
        await tx.contractDocument.create({
          data: {
            contractId,
            url: contractUrl,
            type: "INVOICE",
          },
        });
      }

      return contract;
    });

    return NextResponse.json(
      { data: { id: updatedContract.id, code: updatedContract.code } },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao atualizar contrato." },
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
  organizationId: string,
  excludeContractId?: string
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
      ...(excludeContractId ? { id: { not: excludeContractId } } : {}),
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
