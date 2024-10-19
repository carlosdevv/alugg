import prisma from "@/lib/prismadb";

export async function getUser(userId: string | null) {
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}
