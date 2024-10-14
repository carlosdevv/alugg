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
import { appRoutes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useOrganizationSwitcher from "./use-organization-switcher";

export function OrganizationSwitcher() {
  const {
    organizations,
    currentOrganization,
    isOwner,
    formatRole,
    slug,
    userId,
    avatar,
  } = useOrganizationSwitcher();

  function planBadge(plan: string) {
    return plan === "free" ? (
      <p className="text-left text-xs text-emerald-400 font-medium">Grátis</p>
    ) : (
      <p className="text-left text-xs text-violet-900 font-medium">Pro</p>
    );
  }

  if (!organizations) return <Skeleton className="h-10 rounded-md w-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full hover:bg-neutral-200/50 items-center gap-2 rounded-md p-2 text-sm font-medium outline-none">
        {currentOrganization ? (
          <div className="flex flex-col w-full">
            <div className="flex truncate text-left items-center space-x-2 w-full">
              <Avatar className="size-7 shrink-0 overflow-hidden rounded-full">
                <AvatarImage src={currentOrganization.logo || `${avatar}`} />
                <AvatarFallback className="size-7" />
              </Avatar>
              <div>
                <span>{currentOrganization.name}</span>
                {isOwner ? (
                  <p className="text-xs font-light">Dono</p>
                ) : (
                  <p className="text-xs font-light">
                    {formatRole(currentOrganization.role)}
                  </p>
                )}
              </div>
            </div>
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
          <p className="px-1 text-xs font-medium text-neutral-500 pt-2">
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
              const isActive = organization.slug === slug;
              const isOwner = organization.ownerId === userId;
              const initials = `${organization?.name
                .charAt(0)
                .toUpperCase()}${organization?.name.charAt(1).toUpperCase()}`;
              const avatarVercel = `https://avatar.vercel.sh/${encodeURIComponent(
                organization.id
              )}.svg?text=${initials}`;

              return (
                <DropdownMenuItem
                  key={organization.id}
                  asChild
                  className={cn(
                    "cursor-pointer flex flex-col items-start my-1.5",
                    isActive && "bg-neutral-200/50"
                  )}
                >
                  <Link href={`/${organization.slug}`} shallow={false}>
                    <div className="flex items-center gap-x-2 justify-between">
                      <Avatar className="size-7 shrink-0 overflow-hidden rounded-full">
                        <AvatarImage
                          src={organization.logo || `${avatarVercel}`}
                        />
                        <AvatarFallback className="size-7" />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="truncate text-sm leading-5 text-neutral-800 sm:max-w-[140px]">
                          {organization.name}
                        </span>
                        {isOwner ? (
                          <p className="text-xs">
                            {planBadge(organization.plan)}
                          </p>
                        ) : (
                          <p className="text-xs">
                            {formatRole(organization.role)}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-black">
                          <Icons.check className="size-4" aria-hidden="true" />
                        </span>
                      )}
                    </div>
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
