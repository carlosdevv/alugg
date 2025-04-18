import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations - Get all organizations for an user
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        ownerId: true,
        plan: true,
        logo: true,
        members: {
          select: {
            role: true,
          },
          where: {
            userId,
          },
        },
      },
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });

    if (!organizations) {
      return NextResponse.json(
        { message: "Organizações não encontradas." },
        { status: 404 }
      );
    }

    if (organizations.length === 0) {
      return NextResponse.json({ organizations: [] }, { status: 200 });
    }

    const organizationsWithUserRole = organizations.map(
      ({ members, ...org }) => {
        return {
          ...org,
          role: members[0].role,
        };
      }
    );

    return NextResponse.json(
      { organizations: organizationsWithUserRole },
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

const createOrganizationSchema = z.object({
  name: z.string(),
  slug: z.string(),
  plan: z.enum(["free", "pro"]),
});

// POST /api/organizations - Create a new organization
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = createOrganizationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

    const { name, plan, slug } = parsed.data;
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        plan,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        defaultOrganization: organization.slug,
      },
    });

    return NextResponse.json(
      { organizationId: organization.id, slug: organization.slug },
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
