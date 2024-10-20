import prisma from "@/lib/prismadb";
import type { User } from "@prisma/client";

export async function getDefaultOrganization(user: User | null) {
  let defaultOrganization = user?.defaultOrganization;

  if (!defaultOrganization) {
    const refreshedUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        defaultOrganization: true,
        owns_organizations: {
          select: {
            slug: true,
          },
          take: 1,
        },
      },
    });

    defaultOrganization =
      refreshedUser?.defaultOrganization ||
      refreshedUser?.owns_organizations[0]?.slug ||
      null;

    if (defaultOrganization) {
      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          defaultOrganization,
        },
      });
    }
  }

  return defaultOrganization;
}
