import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../../lib/prismadb";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { categoryId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: `Usuário <${userId}> não encontrado.` },
        { status: 404 }
      );
    }

    const existentCategory = await prisma.category.findUnique({
      select: {
        id: true,
        name: true,
        inventoryId: true
      },
      where: {
        id: categoryId,
      },
    });

    if (existentCategory === null) {
      return NextResponse.json(
        { message: `Categoria <${categoryId}> não encontrada.` },
        { status: 204 }
      );
    }

    const itemCount = await prisma.inventoryItem.count({
      where: {
        categoryId: existentCategory.id,
      },
    });

    const category = {
      ...existentCategory,
      totalItems: itemCount
    };

    return NextResponse.json(
      { category: category },
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

const updateCategorySchema = z.object({
  name: z.string().optional(),
  inventoryId: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { categoryId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: `Usuário <${userId}> não encontrado.` },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

    const { name, inventoryId } = parsed.data;

    const existentCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existentCategory) {
      return NextResponse.json(
        { message: `Categoria <${categoryId}> não encontrada.` },
        { status: 404 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name || existentCategory.name,
        inventoryId: inventoryId || existentCategory.inventoryId,
      },
    });

    return NextResponse.json(
      { id: updatedCategory.id, name: updatedCategory.name },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { categoryId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: `Usuário <${userId}> não encontrado.` },
        { status: 404 }
      );
    }

    const existentCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existentCategory) {
      return NextResponse.json(
        { message: `Categoria <${categoryId}> não encontrada.` },
        { status: 404 }
      );
    }

    await prisma.inventoryItem.updateMany({
      where: {
        categoryId: categoryId,
      },
      data: {
        categoryId: "",
      },
    });

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(
      { message: `Categoria <${categoryId}> deletada com sucesso.` },
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
