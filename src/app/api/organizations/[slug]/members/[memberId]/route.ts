import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import { roleSchema } from "@/lib/casl/roles";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const updateMemberSchema = z.object({
  role: roleSchema,
});

// PUT /api/organizations/:slug/members/:memberId - Update a member's role
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string; memberId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, memberId } = params;

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
    const parsed = updateMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

    const { role } = parsed.data;

    const { organization, membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("update", "User")) {
      return NextResponse.json(
        { message: "Você não tem permissão para atualizar membros." },
        { status: 401 }
      );
    }

    await prisma.member.update({
      where: {
        id: memberId,
        organizationId: organization.id,
      },
      data: {
        role,
      },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/:slug/members/:memberId - Remove a member from an organization
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; memberId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, memberId } = params;

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

    const { organization, membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("delete", "User")) {
      return NextResponse.json(
        { message: "Você não tem permissão para deletar membros." },
        { status: 401 }
      );
    }

    const isOwner = await prisma.organization.findFirst({
      where: {
        id: organization.id,
        ownerId: memberId,
      },
    });

    if (isOwner) {
      return NextResponse.json(
        { message: "Não é possivel remover o dono da organização." },
        { status: 401 }
      );
    }

    await prisma.member.delete({
      where: {
        id: memberId,
        organizationId: organization.id,
      },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

// GET /api/organizations/:slug/members/:memberId - Get a member by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; memberId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, memberId } = params;

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

    if (!memberId) {
      return NextResponse.json(
        { message: "É necessário informar o ID do Membro." },
        { status: 400 }
      );
    }

    const { organization, membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("get", "User")) {
      return NextResponse.json(
        { message: "Você não tem permissão para visualizar membros." },
        { status: 401 }
      );
    }

    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        organizationId: organization.id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Membro não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        memberId: member.id,
        name: member.user.name,
        userId: member.user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
