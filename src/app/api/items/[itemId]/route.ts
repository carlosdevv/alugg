import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import prisma from "../../../../lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = auth();
    const { itemId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const foundItem = await prisma.inventoryItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (foundItem == null) {
      return NextResponse.json({ status: 204 });
    }

    const inventory = await prisma.inventory.findUnique({
      where: {
        id: foundItem.inventoryId,
      },
    });

    if (inventory?.ownerId == userId) {
      return NextResponse.json(
        { message: "User not authorized to find items of another owner." },
        { status: 403 }
      );
    }

    return NextResponse.json({ foundItem }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

const updateItemSchema = z.object({
  name: z.string().min(3).optional(),
  categoryId: z.string().optional(),
  amount: z.coerce.number().positive().optional(),
  objectPrice: z.number().positive().optional(),
  rentPrice: z.number().positive().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  itemInRenovation: z.coerce.boolean().optional(),
  itemInactive: z.coerce.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "User not found." }, { status: 403 });
    }

    const parsed = updateItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Atributtes are missing: " + parsed.error },
        { status: 400 }
      );
    }

    const { itemId } = params;

    const item = await prisma.inventoryItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    const inventory = await prisma.inventory.findUnique({
      where: {
        id: item.inventoryId,
      },
    });

    if (inventory?.ownerId != userId) {
      return NextResponse.json(
        { message: "User not authorized to delete items of another owner." },
        { status: 403 }
      );
    }
    const updatedItem = await prisma.inventoryItem.update({
      where: {
        id: itemId,
      },
      data: {
        name: parsed.data.name,
        categoryId: parsed.data.categoryId,
        amount: parsed.data.amount,
        objectPrice: parsed.data.objectPrice,
        rentPrice: parsed.data.rentPrice,
        size: parsed.data.size,
        color: parsed.data.color,
        description: parsed.data.description,
        code: parsed.data.code,
        itemInRenovation: parsed.data.itemInRenovation,
        itemInactive: parsed.data.itemInactive,
      },
    });

    return NextResponse.json({ updatedItem }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = auth();
    const { itemId } = params;
    if (!userId) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    const inventory = await prisma.inventory.findUnique({
      where: {
        id: item.inventoryId,
      },
    });

    if (inventory?.ownerId != userId) {
      return NextResponse.json(
        { message: "User not authorized to delete items of another owner." },
        { status: 403 }
      );
    }

    const deletedItem = await prisma.inventoryItem.delete({
      where: {
        id: itemId,
      },
    });

    return NextResponse.json({ deletedItem }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
