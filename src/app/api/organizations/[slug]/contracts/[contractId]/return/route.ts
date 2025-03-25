import { getUserMembership } from "@/actions/get-user-membership";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { ContractDocumentType, ContractStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; contractId: string } }
) {
  try {
    const { userId } = auth();
    const { slug, contractId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (!slug || !contractId) {
      return NextResponse.json(
        { message: "Parâmetros inválidos." },
        { status: 400 }
      );
    }

    const { membership } = await getUserMembership(slug);
    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot("update", "Contract")) {
      return NextResponse.json(
        { message: "Você não tem permissão para realizar esta ação." },
        { status: 403 }
      );
    }

    const { pdfUrl } = await req.json();

    // Buscar o contrato
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      return NextResponse.json(
        { message: "Contrato não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se já existe um documento de devolução para este contrato
    const existingReturnDocument = await prisma.contractDocument.findFirst({
      where: {
        contractId,
        type: ContractDocumentType.RETURN,
      },
    });

    let contractDocument;

    if (existingReturnDocument) {
      // Atualizar o documento existente
      contractDocument = await prisma.contractDocument.update({
        where: { id: existingReturnDocument.id },
        data: { url: pdfUrl },
      });
    } else {
      // Criar novo documento de devolução
      contractDocument = await prisma.contractDocument.create({
        data: {
          type: ContractDocumentType.RETURN,
          url: pdfUrl,
          contractId,
        },
      });
    }

    // Atualizar o status do contrato para CLOSED
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: ContractStatus.CLOSED,
      },
    });

    return NextResponse.json({
      data: {
        pdfUrl,
        documentId: contractDocument.id,
      },
    });
  } catch (error) {
    console.error("Erro ao processar devolução:", error);
    return NextResponse.json(
      { message: "Erro ao processar devolução" },
      { status: 500 }
    );
  }
}
