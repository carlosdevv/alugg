import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../../../lib/prismadb";

const createItemSchema = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string(),
  price: z.number(),
  rentPrice: z.number(),
  objectPrice: z.number(),
  amount: z.number(),
  categoryId: z.string(),
  color: z.string(),
  available: z.boolean(),
  inventoryId: z.string(),
  size: z.string(),
  itemInRenovation: z.boolean(),
  status: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = req.json();
    const parsed = createItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Bad Request: " + parsed.error.message },
        { status: 401 }
      );
    }

    const {
      name,
      description,
      rentPrice,
      amount,
      objectPrice,
      categoryId,
      code,
      color,
      inventoryId,
      size,
      itemInRenovation,
      status,
    } = parsed.data;

    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        description,
        rentPrice,
        amount,
        objectPrice,
        code,
        Inventory: {
          connect: { id: inventoryId },
        },
        category: {
          connect: { id: categoryId },
        },
        color,
        size,
        itemInRenovation,
        status,
      },
    });
  } catch (error) {}
}
