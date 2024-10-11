import Link from "next/link";

import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrganizationsService } from "@/http/organizations/use-organizations-service";
import { appRoutes } from "@/lib/constants";
import { useAuth } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function OrganizationSwitcher() {
  const { data: organizations } = useGetOrganizationsService();
  const { userId } = useAuth();

  const { slug: currentSlug } = useParams() as {
    slug?: string;
  };

  // Prevent slug from changing to empty to avoid UI switching during nav animation
  const [slug, setSlug] = useState(currentSlug);
  useEffect(() => {
    if (currentSlug) setSlug(currentSlug);
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

  function planBadge(plan: string) {
    return plan === "free" ? (
      <p className="text-left text-xs text-emerald-400 font-medium">Free</p>
    ) : (
      <p className="text-left text-xs text-violet-900 font-medium">Pago</p>
    );
  }

  if (!organizations) return <Skeleton className="h-10 rounded-md w-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full hover:bg-neutral-200/50 items-center gap-2 rounded-md p-2 text-sm font-medium outline-none">
        {currentOrganization ? (
          <div className="flex flex-col w-full">
            <div className="flex truncate text-left items-center space-x-2 w-full">
              <span>{currentOrganization.name}</span>
              {isOwner ? (
                <p className="text-xs font-light">(Dono)</p>
              ) : (
                <p className="text-xs font-light">
                  ({formatRole(currentOrganization.role)})
                </p>
              )}
            </div>
            {isOwner && planBadge(currentOrganization.plan)}
          </div>
        ) : (
          <span className="text-muted-foreground truncate">
            Selecione a organização
          </span>
        )}

        <Icons.chevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-2 max-h-80 w-full sm:w-64 sm:text-sm">
        <DropdownMenuGroup>
          <p className="px-1 text-xs font-medium text-neutral-500 py-2">
            Organizações
          </p>
          {!organizations ||
            (organizations.length === 0 && (
              <DropdownMenuItem asChild>
                <span className="truncate text-sm leading-5 text-neutral-800 sm:max-w-[140px]">
                  Sem organizações
                </span>
              </DropdownMenuItem>
            ))}
          {organizations &&
            organizations.map((organization) => {
              return (
                <DropdownMenuItem
                  key={organization.id}
                  asChild
                  className="cursor-pointer"
                >
                  <Link href={`/${organization.slug}`}>
                    <span className="truncate text-sm leading-5 text-neutral-800 sm:max-w-[140px]">
                      {organization.name}
                    </span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuGroup>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={appRoutes.createOrganization}>
            <Icons.circlePlus className="mr-4 size-4 text-neutral-500" />
            <span className="text-sm text-neutral-800">Criar organização</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
