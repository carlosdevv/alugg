import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import { organizationSchema } from "@/lib/casl/models/organization";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const transferOwnershipSchema = z.object({
  transferToUserId: z.string().uuid(),
});

// PATCH /api/organizations/:slug/owner - Transfer ownership of an organization
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    const { slug } = params;
    const body = await req.json();
    const parsed = transferOwnershipSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

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

    const authOrganization = organizationSchema.parse(organization);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("transfer_ownership", authOrganization)) {
      return NextResponse.json(
        { message: "Você não tem permissão para executar essa ação." },
        { status: 403 }
      );
    }

    const { transferToUserId } = parsed.data;

    const transferMembership = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: transferToUserId,
        },
      },
    });

    if (!transferMembership) {
      return NextResponse.json(
        { message: "Usuário alvo não é membro dessa organização." },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.member.update({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: transferToUserId,
          },
        },
        data: {
          role: "ADMIN",
        },
      }),
      prisma.organization.update({
        where: { id: organization.id },
        data: { ownerId: transferToUserId },
      }),
    ]);

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
