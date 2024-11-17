import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

// GET /api/organizations/:slug/invites/:inviteId - Get invite by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; inviteId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, inviteId } = params;

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

    if (!inviteId) {
      return NextResponse.json(
        { message: "É necessário informar o ID do Convite." },
        { status: 400 }
      );
    }

    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!invite) {
      return NextResponse.json(
        { message: "Convite não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ invite }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/:slug/invites/:inviteId - Revoke an invite by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; inviteId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, inviteId } = params;

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

    if (!inviteId) {
      return NextResponse.json(
        { message: "É necessário informar o ID do Convite." },
        { status: 400 }
      );
    }

    const { organization, membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("delete", "Invite")) {
      return NextResponse.json(
        { message: "Você não tem permissão para revogar convites." },
        { status: 403 }
      );
    }

    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
        organizationId: organization.id,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { message: "Convite não encontrado." },
        { status: 404 }
      );
    }

    await prisma.invite.delete({
      where: {
        id: inviteId,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
