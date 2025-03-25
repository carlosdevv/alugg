"use server";

import prisma from "@/lib/prismadb";

export default async function checkIfCodeExistsAction(
  code: string
): Promise<boolean> {
  const hasCode = await prisma.item.findFirst({
    where: {
      code,
    },
  });

  if (hasCode) return true;

  return false;
}
