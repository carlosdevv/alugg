import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserMembership } from "../../../../../actions/get-user-membership";
import { getUserPermissions } from "../../../../../lib/casl/get-user-permissions";
import prisma from "../../../../../lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();

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
  itemInRenovation: z.boolean().optional(),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]).optional(),
  imageUrl: z.string().url().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const parsed = createItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Bad Request: " + parsed.error.message },
        { status: 404 }
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
      itemInRenovation,
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
        itemInRenovation,
        organization: {
          connect: { id: organization.id },
        },
        status,
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
  itemInRenovation: z.boolean().optional(),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]).optional(),
  imageUrl: z.string().url().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

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
      itemInRenovation,
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
        itemInRenovation,
        status,
        imageUrl,
      },
    });
    return NextResponse.json({
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
