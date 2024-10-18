import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import prisma from "../../../../lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = auth();
    const { itemId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const foundItem = await prisma.inventoryItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (foundItem == null) {
      return NextResponse.json({ status: 204 });
    }

    const inventory = await prisma.inventory.findUnique({
      where: {
        id: foundItem.inventoryId,
      },
    });

    if (inventory?.ownerId == userId) {
      return NextResponse.json(
        { message: "User not authorized to find items of another owner." },
        { status: 403 }
      );
    }

    return NextResponse.json({ foundItem }, { status: 200 });
  } catch (error) {
    console.log("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

const createOrganizationSchema = z.object({
  name: z.string(),
  plan: z.enum(["free", "pro"]),
});

export async function POST(req: NextRequest) {}
