import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/items/:itemId - Get item by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = auth();

    const id = params.itemId;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
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
      return NextResponse.json(
        { message: "Item não encontrado." },
        { status: 404 }
      );
    }

    if (item.organization.ownerId != userId) {
      return NextResponse.json(
        {
          message:
            "Você não tem permissão para ver um item que você não é dono.",
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
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE", "IN_REPAIR"]).optional(),
  imageUrl: z.string().url().optional(),
});

// PATCH /api/organizations/:slug/items/:id - Update item by ID
export async function PATCH(
  req: NextRequest,
  { params: { id, slug } }: { params: { slug: string; id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
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
      return NextResponse.json(
        { message: "Item não encontrado." },
        { status: 404 }
      );
    }

    const { cannot } = getUserPermissions(userId, membership.role);

    if (item.organizationId != organization.id || cannot("update", "Item")) {
      return NextResponse.json(
        {
          message:
            "Você não tem permissão para atualizar um item que você não é dono.",
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

// DELETE /api/organizations/:slug/items/:id - Delete item by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
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
      return NextResponse.json(
        { message: "Item não encontrado." },
        { status: 404 }
      );
    }

    if (item.organizationId != organization.id) {
      return NextResponse.json(
        {
          message:
            "Você não tem permissão para deletar um item que você não é dono.",
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
