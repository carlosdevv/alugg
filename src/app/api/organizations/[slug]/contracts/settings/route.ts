import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    const { slug } = params;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Slug não encontrado" },
        { status: 404 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { slug: params.slug },
      select: {
        contractDaysBefore: true,
        contractDaysAfter: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organização não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        daysBefore: organization.contractDaysBefore,
        daysAfter: organization.contractDaysAfter,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar configurações de contrato:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações de contrato" },
      { status: 500 }
    );
  }
}

const contractSettingsSchema = z.object({
  daysBefore: z.number().min(0),
  daysAfter: z.number().min(0),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    const { slug } = params;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Slug não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = contractSettingsSchema.parse(body);

    const updatedOrganization = await prisma.organization.update({
      where: { slug: params.slug },
      data: {
        contractDaysBefore: validatedData.daysBefore,
        contractDaysAfter: validatedData.daysAfter,
      },
    });

    return NextResponse.json({
      daysBefore: updatedOrganization.contractDaysBefore,
      daysAfter: updatedOrganization.contractDaysAfter,
    });
  } catch (error) {
    console.error("Erro ao atualizar configurações de contrato:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configurações de contrato" },
      { status: 500 }
    );
  }
}
