import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/items - Get all items
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { slug } = params;

    const { organization } = await getUserMembership(slug);

    const items = await prisma.item.findMany({
      where: {
        organizationId: organization.id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

const createItemSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  description: z.string().optional(),
  rentPrice: z.number().gte(0),
  objectPrice: z.number().gte(0),
  amount: z.number().gte(0),
  categoryId: z.string().min(1),
  color: z.string().optional(),
  size: z.string().optional(),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE", "IN_REPAIR"]).optional(),
  imageUrl: z.string().url().optional(),
});

// POST /api/organizations/:slug/items - Create a new item
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const body = await req.json();

    const parsed = createItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." + parsed.error.message },
        { status: 400 }
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
      size,
      status,
      imageUrl,
    } = parsed.data;

    const { organization, membership } = await getUserMembership(params.slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("create", "Item")) {
      return NextResponse.json(
        { message: "Você não tem permissão para criar itens." },
        { status: 403 }
      );
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        rentPrice,
        amount,
        objectPrice,
        code,
        category: {
          connect: { id: categoryId },
        },
        color,
        size,
        status,
        organization: {
          connect: { id: organization.id },
        },
        imageUrl,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}

const updateItemSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  rentPrice: z.number().optional(),
  objectPrice: z.number().optional(),
  amount: z.number().optional(),
  categoryId: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE", "IN_REPAIR"]).optional(),
  imageUrl: z.string().url().optional(),
});

// PUT /api/organizations/:slug/items/:id - Update an item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = req.json();
    const parsed = updateItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Bad Request: " + parsed.error.message },
        { status: 401 }
      );
    }

    const { id } = params;
    const {
      name,
      description,
      rentPrice,
      amount,
      objectPrice,
      categoryId,
      code,
      color,
      size,
      status,
      imageUrl,
    } = parsed.data;

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
        rentPrice,
        amount,
        objectPrice,
        code,
        category: {
          connect: { id: categoryId },
        },
        color,
        size,
        status,
        imageUrl,
      },
    });
    return NextResponse.json({
      message: "Item atualizado com sucesso.",
      data: updatedItem,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
