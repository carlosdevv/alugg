import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { NextResponse, type NextRequest } from "next/server";

// GET /api/organizations/:slug/members - Get all members of an organization
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

    const { organization, membership } = await getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("get", "User")) {
      return NextResponse.json(
        { message: "Você não tem permissão para acessar os membros." },
        { status: 403 }
      );
    }

    const members = await prisma.member.findMany({
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            owns_organizations: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        organizationId: organization.id,
      },
      orderBy: {
        role: "asc",
      },
    });

    const membersWithRoles = members.map(
      ({ user: { id: userId, owns_organizations, ...user }, ...member }) => {
        return {
          ...user,
          ...member,
          userId,
          isOwner: owns_organizations.some((org) => org.id === organization.id),
        };
      }
    );

    return NextResponse.json({ members: membersWithRoles }, { status: 200 });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
