import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

// GET /api/organizations/:slug/invites/pending-invites - Get all pending invites
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

    const invites = await prisma.invite.findMany({
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
      where: {
        email: user.email,
      },
    });

    return NextResponse.json({ invites }, { status: 200 });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
