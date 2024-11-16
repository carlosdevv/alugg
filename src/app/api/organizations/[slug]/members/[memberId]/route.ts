import { getUserMembership } from "@/actions/get-user-membership";
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

    const { organization } = await getUserMembership(slug);

    await prisma.member.update({
      where: {
        id: memberId,
        organizationId: organization.id,
      },
      data: {
        role,
      },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
