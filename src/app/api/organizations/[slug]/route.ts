import { getUserMembership } from "@/actions/get-user-membership";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

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
    console.log("ERR:", error);
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
});

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

    const { name, newSlug } = parsed.data;

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

    const updatedOrg = await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        name: name || organization.name,
        slug: newSlug || organization.slug,
      },
    });

    return NextResponse.json(
      { organizationId: organization.id, slug: updatedOrg.slug },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

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

    const { organization } = await getUserMembership(slug);

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

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
