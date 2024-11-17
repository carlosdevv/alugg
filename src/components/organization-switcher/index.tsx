import Link from "next/link";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import useOrganizationSwitcher from "./use-organization-switcher";

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar();
  const {
    organizations,
    currentOrganization,
    isOwner,
    formatRole,
    slug,
    userId,
    avatar,
    setModal,
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex w-full hover:bg-neutral-200/50 items-center gap-2 rounded-md p-2 text-sm font-medium outline-none"
            >
              {currentOrganization ? (
                <div className="flex truncate text-left items-center space-x-2 w-full">
                  <Avatar className="size-7 shrink-0 overflow-hidden rounded-full">
                    <AvatarImage
                      src={currentOrganization.logo || `${avatar}`}
                    />
                    <AvatarFallback className="size-7" />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentOrganization.name.charAt(0).toUpperCase() +
                        currentOrganization.name.slice(1)}
                    </span>
                    <span className="truncate text-xs">
                      {isOwner ? "Dono" : formatRole(currentOrganization.role)}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground truncate">
                  Selecione a organização
                </span>
              )}
              <Icons.chevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizações
            </DropdownMenuLabel>
            <DropdownMenuGroup>
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
                    .toUpperCase()}${organization?.name
                    .charAt(1)
                    .toUpperCase()}`;
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
                              {organization.name.charAt(0).toUpperCase() +
                                organization.name.slice(1)}
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
                              <Icons.check
                                className="size-4"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer gap-2 p-2"
              onClick={() => setModal("create-organization")}
            >
              <Icons.circlePlus className="mr-4 size-4 text-neutral-500" />
              <span className="font-medium text-muted-foreground">
                Criar organização
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
