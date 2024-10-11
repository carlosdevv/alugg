import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function getUserMembership(slug: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error(`Usuário não encontrado.`);
  }

  const member = await prisma.member.findFirst({
    where: {
      userId,
      organization: {
        slug,
      },
    },
    include: {
      organization: true,
    },
  });

  if (!member) {
    throw new Error(`Você não é membro dessa org.`);
  }

  const { organization, ...membership } = member;

  return {
    organization,
    membership,
  };
}
