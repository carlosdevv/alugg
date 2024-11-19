import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/categories/:categoryId – Get a category
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, categoryId } = params;

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

    if (!categoryId) {
      return NextResponse.json(
        { message: "É necessário informar o ID da Categoria." },
        { status: 400 }
      );
    }

    const existentCategory = await prisma.category.findUnique({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: categoryId,
      },
    });

    if (existentCategory === null) {
      return new Response(null, {
        status: 204,
      });
    }

    const itemCount = await prisma.inventoryItem.count({
      where: {
        categoryId: existentCategory.id,
      },
    });

    const category = {
      ...existentCategory,
      totalItems: itemCount,
    };

    return NextResponse.json({ category: category }, { status: 200 });
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
});

// PATCH /api/organizations/:slug/categories/:categoryId – Update a category
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, categoryId } = params;

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

    if (!categoryId) {
      return NextResponse.json(
        { message: "É necessário informar o ID da Categoria." },
        { status: 400 }
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

    const { name } = parsed.data;
    const { membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("update", "Category")) {
      return NextResponse.json(
        { message: "Você não tem permissão para atualizar categorias." },
        { status: 403 }
      );
    }

    const existentCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existentCategory) {
      return NextResponse.json(
        { message: `Categoria não encontrada.` },
        { status: 404 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name || existentCategory.name,
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

// DELETE /api/organizations/:slug/categories/:categoryId – Delete a category
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, categoryId } = params;

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

    if (!categoryId) {
      return NextResponse.json(
        { message: "É necessário informar o ID da Categoria." },
        { status: 400 }
      );
    }

    const { membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("delete", "Category")) {
      return NextResponse.json(
        { message: "Você não tem permissão para deletar categorias." },
        { status: 403 }
      );
    }

    const existentCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existentCategory) {
      return NextResponse.json(
        { message: `Categoria não encontrada.` },
        { status: 404 }
      );
    }

    await prisma.inventoryItem.updateMany({
      where: {
        categoryId: categoryId,
      },
      data: {
        categoryId: undefined,
      },
    });

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(
      { message: `Categoria deletada com sucesso.` },
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
