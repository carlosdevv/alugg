import { getUserId } from "@/actions/user/get-user-id";
import prisma from "@/lib/prismadb";
import { NextResponse, type NextRequest } from "next/server";

// POST /api/organizations/:slug/invites/:inviteId/reject - Reject an invite
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; inviteId: string } }
) {
  try {
    const userId = await getUserId();
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
    });

    if (!invite) {
      return NextResponse.json(
        { message: "Convite não encontrado." },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (invite.email !== user.email) {
      return NextResponse.json(
        { message: "O convite não pertence a esse usuário." },
        { status: 401 }
      );
    }

    await prisma.invite.delete({
      where: {
        id: invite.id,
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
