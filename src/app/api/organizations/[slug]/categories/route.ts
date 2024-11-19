import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/categories – Get all categories
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
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

    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    if (allCategories.length === 0) {
      return NextResponse.json({ category: [] }, { status: 200 });
    }

    const categories = await Promise.all(
      allCategories.map(async (category) => {
        const itemCount = await prisma.inventoryItem.count({
          where: {
            categoryId: category.id,
          },
        });

        return {
          ...category,
          totalItems: itemCount,
        };
      })
    );

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

const createCategorySchema = z.object({
  name: z.string(),
});

// POST /api/workspaces/[slug]/categories – Create a new category
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
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
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

    const { name } = parsed.data;
    const { membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("create", "Category")) {
      return NextResponse.json(
        { message: "Você não tem permissão para criar categorias." },
        { status: 403 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
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
