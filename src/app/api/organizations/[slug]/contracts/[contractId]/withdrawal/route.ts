import { getUserMembership } from "@/actions/get-user-membership";
import { getUserId } from "@/actions/user/get-user-id";
import { getUserPermissions } from "@/lib/casl/get-user-permissions";
import prisma from "@/lib/prismadb";
import { ContractDocumentType, ContractStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; contractId: string } }
) {
  try {
    const userId = await getUserId();
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

    // Verificar se já existe um documento de retirada para este contrato
    const existingWithdrawalDocument = await prisma.contractDocument.findFirst({
      where: {
        contractId,
        type: ContractDocumentType.WITHDRAWAL,
      },
    });

    let contractDocument;

    if (existingWithdrawalDocument) {
      // Atualizar o documento existente
      contractDocument = await prisma.contractDocument.update({
        where: { id: existingWithdrawalDocument.id },
        data: { url: pdfUrl },
      });
    } else {
      // Criar novo documento de retirada
      contractDocument = await prisma.contractDocument.create({
        data: {
          type: ContractDocumentType.WITHDRAWAL,
          url: pdfUrl,
          contractId,
        },
      });
    }

    // Atualizar o status do contrato para COLLECTED
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: ContractStatus.COLLECTED,
      },
    });

    return NextResponse.json({
      data: {
        pdfUrl,
        documentId: contractDocument.id,
      },
    });
  } catch (error) {
    console.error("Erro ao processar retirada:", error);
    return NextResponse.json(
      { message: "Erro ao processar retirada" },
      { status: 500 }
    );
  }
}
