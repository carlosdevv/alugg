import { useGetOrganizationsService } from "@/http/organizations/use-organizations-service";
import { useAuth } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import sessionStore from "../../hooks/session-context";

export default function useOrganizationSwitcher() {
  const { userId } = useAuth();
  const { setSlug: setSlugSessionStore } = sessionStore();

  const { data: organizations } = useGetOrganizationsService();

  const { slug: currentSlug } = useParams() as {
    slug?: string;
  };

  const [, setModal] = useQueryState("modal");

  // Prevent slug from changing to empty to avoid UI switching during nav animation
  const [slug, setSlug] = useState(currentSlug);
  useEffect(() => {
    if (currentSlug) {
      setSlugSessionStore(currentSlug);
      setSlug(currentSlug);
    }
  }, [currentSlug]);

  const currentOrganization = useMemo(() => {
    const selectedOrganization = organizations?.find(
      (organization) => organization.slug === slug
    );

    if (slug && organizations && selectedOrganization) {
      return {
        ...selectedOrganization,
      };
    }

    return null;
  }, [organizations, slug]);

  const isOwner = useMemo(
    () => currentOrganization?.ownerId === userId,
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
