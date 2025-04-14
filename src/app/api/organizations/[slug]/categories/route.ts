import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/categories – get all categories
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const userId = await getUserId();
    const { slug } = await params;
    const searchParams = req.nextUrl.searchParams;
    const categoryName = searchParams.get("categoryName");

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

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

    const { organization } = await getUserMembership(slug);

    // Base filter
    const baseFilter = {
      organizationId: organization.id,
    };

    // Add name filter if provided
    let nameFilter = {};
    if (categoryName) {
      nameFilter = {
        name: {
          contains: categoryName,
          mode: "insensitive" as const,
        },
      };
    }

    const whereFilter = { ...baseFilter, ...nameFilter };

    const [categories, totalCategories] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        where: whereFilter,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.category.count({
        where: whereFilter,
      }),
    ]);

    // Get item counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const itemCount = await prisma.item.count({
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

    return NextResponse.json({
      categories: categoriesWithCounts,
      total: totalCategories,
      pagination: {
        total: totalCategories,
        pages: Math.ceil(totalCategories / limit),
        page,
        limit,
      },
    });
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

// POST /api/organizations/:slug/categories – create a new category
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId();
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
    const { membership, organization } = await getUserMembership(slug);

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
        organization: {
          connect: { id: organization.id },
        },
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
