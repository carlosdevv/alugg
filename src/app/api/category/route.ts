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

    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        inventoryId: true
      }
    });

    if(allCategories.length === 0){
      return NextResponse.json(
        { message: `Categorias não encontradas.` },
        { status: 204 }
      )
    }

    const categories = await Promise.all(allCategories.map(async (category) => {
      const itemCount = await prisma.inventoryItem.count({
        where: {
          categoryId: category.id
        }
      });
    
      return {
        ...category,
        totalItems: itemCount
      };
    }));

    return NextResponse.json({ categories }, { status: 200 });
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
