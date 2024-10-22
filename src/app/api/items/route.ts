import prisma from "@/lib/prismadb";
import { createSlug } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const createItemSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  categoryId: z.string({ required_error: "Categoria é obrigatória" }),
  amount: z.coerce
    .number({ required_error: "Quantidade é obrigatória" })
    .positive({ message: "Quantidade deve ser maior que 0" }),
  objectPrice: z
    .number({ required_error: "Valor do Objeto é obrigatório" })
    .positive({ message: "Valor do Objeto deve ser maior que 0" }),
  rentPrice: z
    .number({ required_error: "Valor do Aluguel é obrigatório" })
    .positive({ message: "Valor do Aluguel deve ser maior que 0" }),
  size: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  itemInRenovation: z.coerce.boolean().default(false),
  itemInactive: z.coerce.boolean().default(false),
  inventoryId: z.string({ required_error: "Inventory Id must be provided" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = createItemSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { message: validatedData.error.message },
        { status: 400 }
      );
    }

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 401 }
      );
    }

    const {
      name,
      categoryId,
      amount,
      objectPrice,
      rentPrice,
      size,
      color,
      description,
      code,
      itemInRenovation,
      itemInactive,
      inventoryId,
    } = body;

    var inventory = await prisma.inventory.findFirst({
      where: { id: inventoryId },
    });

    if (!inventory) {
      return NextResponse.json(
        { message: "Inventory not found." },
        { status: 400 }
      );
    }

    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        category: {
          connect: {
            id: categoryId,
          },
        },
        amount,
        objectPrice,
        rentPrice,
        size,
        color,
        description,
        code: code || createSlug(name),
        itemInRenovation,
        itemInactive,
        inventoryId,
        Inventory: {
          connect: {
            id: inventoryId,
          },
        },
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
