import prisma from "@/lib/prismadb";
import { getUserId } from "./user/get-user-id";

export async function getUserMembership(slug: string) {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Usuário não encontrado.");
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
    throw new Error("Você não é membro dessa organização.");
  }

  const { organization, ...membership } = member;

  return {
    organization,
    membership,
  };
}
