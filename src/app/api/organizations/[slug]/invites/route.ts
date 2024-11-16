import { getUserMembership } from "@/actions/get-user-membership";
import { roleSchema } from "@/lib/casl/roles";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug/invites - Get all invites for an organization
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

    const { organization } = await getUserMembership(slug);

    const invites = await prisma.invite.findMany({
      where: {
        organizationId: organization.id,
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
      },
      orderBy: {
        createdAt: "desc",
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

const createInviteSchema = z.object({
  email: z.string().email(),
  role: roleSchema,
});

// POST /api/organizations/:slug/invites - Create an invite for an organization
export async function POST(
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

    const body = await req.json();
    const parsed = createInviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

    const { email, role } = parsed.data;
    const { organization } = await getUserMembership(slug);

    const inviteWithSameEmail = await prisma.invite.findUnique({
      where: {
        email_organizationId: {
          email,
          organizationId: organization.id,
        },
      },
    });

    if (inviteWithSameEmail) {
      return NextResponse.json(
        { message: "Já existe um convite para esse email." },
        { status: 400 }
      );
    }

    const memberWithSameEmail = await prisma.member.findFirst({
      where: {
        organizationId: organization.id,
        user: {
          email,
        },
      },
    });

    if (memberWithSameEmail) {
      return NextResponse.json(
        { message: "Um membro com esse email já pertence a sua organização." },
        { status: 400 }
      );
    }

    const invite = await prisma.invite.create({
      data: {
        organizationId: organization.id,
        email,
        role,
        authorId: userId,
      },
    });

    return NextResponse.json(
      {
        inviteId: invite.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
