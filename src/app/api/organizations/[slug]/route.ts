import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import { organizationSchema } from "@/lib/casl/models/organization";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// GET /api/organizations/:slug - Get an organization
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

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

const updateOrganizationSchema = z.object({
  name: z
    .string()
    .max(32, {
      message: "Máximo de 32 caracteres",
    })
    .optional(),
  newSlug: z
    .string()
    .min(3, { message: "Slug deve ter no mínimo 3 caracteres" })
    .max(48, { message: "Slug deve ter no máximo 48 caracteres" })
    .optional(),
  fantasyName: z.string().optional(),
  socialName: z.string().optional(),
  cnpj: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return value.length === 14 || value.length === 18;
      },
      { message: "CNPJ inválido" }
    ),
  phone: z.string().optional(),
  email: z.string().optional(),
  zipcode: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        if (value.length === 8 || (value.length === 9 && value.includes("-")))
          return true;
        return false;
      },
      {
        message: "CEP inválido",
      }
    ),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
  logo: z.string().optional(),
});

// PATCH /api/organizations/:slug - Update an organization
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    const { slug } = params;
    const body = await req.json();
    const parsed = updateOrganizationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Informações incorretas." },
        { status: 401 }
      );
    }

    const { ...data } = parsed.data;

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

    if (cannot("update", authOrganization)) {
      return NextResponse.json(
        { message: "Você não tem permissão para atualizar essa organização." },
        { status: 401 }
      );
    }

    const updatedOrg = await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        ...data,
        slug: data.newSlug || organization.slug,
      },
    });

    if (slug !== data.newSlug) {
      await prisma.user.update({
        where: { id: userId },
        data: { defaultOrganization: data.newSlug },
      });
    }

    return NextResponse.json({ organization: updatedOrg }, { status: 200 });
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/:slug - Delete an organization
export async function DELETE(
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

    const { organization, membership } = await getUserMembership(slug);

    const authOrganization = organizationSchema.parse(organization);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("delete", authOrganization)) {
      return NextResponse.json(
        { message: "Você não tem permissão para deletar essa organização." },
        { status: 401 }
      );
    }

    const isOwner = organization.ownerId === userId;

    if (!isOwner) {
      return NextResponse.json(
        { message: "Você não tem permissão para deletar essa organização." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user?.defaultOrganization === organization.slug) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          defaultOrganization: null,
        },
      });
    }

    await prisma.organization.delete({
      where: {
        id: organization.id,
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
