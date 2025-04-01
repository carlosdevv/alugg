import { getUserId } from "@/actions/user/get-user-id";
import prisma from "@/lib/prismadb";
import { NextResponse, type NextRequest } from "next/server";

// GET /api/organizations/:slug/exists – check if a project exists
export async function GET(
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

    const organization = await prisma.organization.findUnique({
      where: {
        slug,
      },
      select: {
        slug: true,
      },
    });

    if (!organization) {
      return NextResponse.json({ hasOrganization: false }, { status: 200 });
    }

    return NextResponse.json({ hasOrganization: true }, { status: 200 });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
