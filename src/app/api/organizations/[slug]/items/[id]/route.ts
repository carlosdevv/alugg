import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserMembership } from "../../../../../../actions/get-user-membership";
import { getUserPermissions } from "../../../../../../lib/casl/get-user-permissions";
import prisma from "../../../../../../lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    const id = params.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User not autheticated" },
        { status: 401 }
      );
    }

    const item = await prisma.item.findUnique({
      where: {
        id,
      },
      include: {
        organization: {
          include: {
            owner: {
              select: {
                id: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    if (item.organization.ownerId != userId) {
      return NextResponse.json(
        {
          message: "You are not allowed to see items that you are not a owner.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
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
  organizationId: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  itemInRenovation: z.boolean().optional(),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]).optional(),
  imageUrl: z.string().url().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params: { id, slug } }: { params: { slug: string; id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "User not autheticated" },
        { status: 401 }
      );
    }

    const { organization, membership } = await getUserMembership(slug);

    const item = await prisma.item.findUnique({
      where: {
        id,
      },
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    const { cannot } = getUserPermissions(userId, membership.role);

    if (item.organizationId != organization.id || cannot("update", "Item")) {
      return NextResponse.json(
        {
          message:
            "You are not allowed to update an item who you aren't an owner.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas: " + parsed.error },
        { status: 401 }
      );
    }
    const {
      name,
      amount,
      categoryId,
      description,
      rentPrice,
      objectPrice,
      organizationId,
      color,
      code,
      size,
      itemInRenovation,
      status,
      imageUrl,
    } = parsed.data;

    const updatedItem = await prisma.item.update({
      where: {
        id,
      },
      data: {
        name,
        amount,
        description,
        rentPrice,
        objectPrice,
        color,
        code,
        size,
        itemInRenovation,
        status,
        imageUrl,
        ...(categoryId && { category: { connect: { id: categoryId } } }), // Add category only if categoryId exists
        ...(organizationId && {
          organization: { connect: { id: organizationId } },
        }),
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "User not autheticated" },
        { status: 401 }
      );
    }

    const { organization } = await getUserMembership(params.slug);

    const item = await prisma.item.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    if (item.organizationId != organization.id) {
      return NextResponse.json(
        {
          message:
            "You are not allowed to delete an item who you aren't an owner.",
        },
        { status: 403 }
      );
    }

    await prisma.item.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      status: 204,
    });
  } catch (err) {
    console.error("ERR:", err);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
