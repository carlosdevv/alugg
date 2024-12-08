import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/customers - Get all customers
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

    const { organization } = await getUserMembership(slug);

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: {
          organizationId: organization.id,
        },
      }),
      prisma.customer.count({
        where: {
          organizationId: organization.id,
        },
      }),
    ]);

    if (total === 0) {
      return NextResponse.json({ customers: [] }, { status: 200 });
    }

    const customersResponse = {
      data: customers,
      total,
    };

    return NextResponse.json({ customersResponse }, { status: 200 });
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
