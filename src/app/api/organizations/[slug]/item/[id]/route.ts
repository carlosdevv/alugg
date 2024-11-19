import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the user is authenticated
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "User not autheticated" },
        { status: 401 }
      );
    }

    const item = await prisma.inventoryItem.findUnique({
      where: {
        id: params.id,
      },
      include: {
        Inventory: {
          select: {
            ownerId: true,
            name: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    if (item.Inventory?.ownerId != userId) {
      return NextResponse.json(
        {
          message: "You are not allowed to see items that you are not a owner.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("ERR:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro, tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
