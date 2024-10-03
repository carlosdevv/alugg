"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appRoutes } from "@/lib/constants";
import useOrganizationSwitcher from "./use-organization-switcher";

type OrganizationSwitcherProps = {
  currentOrg?: string;
};

export function OrganizationSwitcher({
  currentOrg,
}: OrganizationSwitcherProps) {
  const { currentOrganization, organizations } = useOrganizationSwitcher({
    currentOrg,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentOrganization ? (
          <>
            <span className="truncate text-left">
              {currentOrganization.name}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground truncate">
            Selecione a organização
          </span>
        )}
        <Icons.chevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!organizations ||
            (organizations.length === 0 && (
              <DropdownMenuItem asChild>
                <span className="text-muted-foreground">Sem organizações</span>
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
                  <Link href={`/org/${organization.slug}`}>
                    <span className="line-clamp-1">{organization.name}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={appRoutes.createOrganization}>
            <Icons.circlePlus className="mr-2 size-4" />
            Criar organização
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
