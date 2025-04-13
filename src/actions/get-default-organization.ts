import prisma from "@/lib/prismadb";

interface GetDefaultOrganizationProps {
  id: string;
  defaultOrganization: string | null | undefined;
}

export async function getDefaultOrganization({
  id,
  defaultOrganization,
}: GetDefaultOrganizationProps) {
  if (!defaultOrganization) {
    const refreshedUser = await prisma.user.findUnique({
      where: {
        id,
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
          id,
        },
        data: {
          defaultOrganization,
        },
      });
    }
  }

  return defaultOrganization;
}
