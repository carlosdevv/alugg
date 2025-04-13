import { useAuth } from "@/hooks/use-auth";
import { useGetOrganizationsService } from "@/http/organizations/use-organizations-service";
import { Role } from "@prisma/client";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";

export default function useOrganizationSwitcher() {
  const { useSession } = useAuth();
  const session = useSession();
  const userId = session?.data?.user?.id;

  const { data: organizations } = useGetOrganizationsService();

  const { slug: currentSlug } = useParams() as {
    slug?: string;
  };

  const [, setModal] = useQueryState("modal");

  // Prevent slug from changing to empty to avoid UI switching during nav animation
  const [slug, setSlug] = useState(currentSlug);
  useEffect(() => {
    if (currentSlug) {
      setSlug(currentSlug);
    }
  }, [currentSlug]);

  const currentOrganization = useMemo(() => {
    if (!organizations) return null;

    const selectedOrganization = organizations.find(
      (organization) => organization.slug === slug
    );

    if (slug && selectedOrganization) {
      return {
        ...selectedOrganization,
      };
    }

    return null;
  }, [organizations, slug]);

  const isOwner = useMemo(
    () => (userId ? currentOrganization?.ownerId === userId : false),
    [currentOrganization?.ownerId, userId]
  );

  function formatRole(role: string) {
    return role === Role.ADMIN ? "Admin" : "Membro";
  }

  const initials = `${currentOrganization?.name
    .charAt(0)
    .toUpperCase()}${currentOrganization?.name.charAt(1).toUpperCase()}`;

  const avatar =
    currentOrganization &&
    `https://avatar.vercel.sh/${encodeURIComponent(
      currentOrganization.id
    )}.svg?text=${initials}`;

  return {
    organizations,
    currentOrganization,
    isOwner,
    formatRole,
    slug,
    userId,
    avatar,
    setModal,
  };
}
