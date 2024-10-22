import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../../lib/prismadb";

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
      where: {
        id: categoryId,
      },
    });

    return existentCategory
      ? NextResponse.json(
          { message: `Categoria <${categoryId}> não encontrada.` },
          { status: 204 }
        )
      : NextResponse.json({ foundCategory: existentCategory }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const existentCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existentCategory) {
      return NextResponse.json(
        { message: `Categoria <${body.id}> não encontrada.` },
        { status: 404 }
      );
    }

    body.id = categoryId;

    const updatedCategory = await prisma.category.update({
      where: {
        id: body.id,
      },
      data: body,
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
