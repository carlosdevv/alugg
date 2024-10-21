import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: `Usuário <${userId}> não encontrado.` },
        { status: 404 }
      );
    }

    const foundCategories = await prisma.category.findMany();

    return foundCategories.length === 0
      ? NextResponse.json({ message: `Categorias não encontradas.` }, { status: 204 })
      : NextResponse.json({ foundCategories }, { status: 200 });

  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: `Usuário <${userId}> não encontrado.` },
        { status: 404 }
      );
    }

    const body = await req.json();

    const existentCategory = await prisma.category.findUnique({
      where: {
        id: body.id,
      },
    });

    if (existentCategory) {
      return NextResponse.json(
        {
          message: `Categoria <${existentCategory.id}> já existe como: ${existentCategory.name}.`,
        },
        { status: 409 }
      );
    }

    const newCategory = await prisma.category.create({
      data: body,
    });

    return NextResponse.json(
      { id: newCategory.id, name: newCategory.name },
      { status: 201 }
    );
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}