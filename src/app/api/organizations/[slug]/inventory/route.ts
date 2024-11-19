import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prismadb";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const iventories = prisma.inventory.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        categories: {
          select: {
            name: true,
          },
          include: {
            items: {
              select: {
                imageUrl: true,
                code: true,
                name: true,
                rentPrice: true,
                amount: true,
                size: true,
                color: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(iventories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
