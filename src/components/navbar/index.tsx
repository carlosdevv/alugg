import { Icons } from "@/components/icons";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { ClientOnly } from "@/components/ui/client-only";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { Area } from "./area";
import { ITEMS } from "./items";
import { NavItem } from "./nav-item";
import UserDropdown from "./user-dropdown";

const AREAS = ["settings", "default"] as const;

export function Navbar() {
  const { slug } = useParams() as { slug?: string };
  const pathname = usePathname();

  const currentArea = useMemo(() => {
    return pathname.startsWith(`/${slug}/settings`) ? "settings" : "default";
  }, [slug, pathname]);

  return (
    <ClientOnly className="scrollbar-hide relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      <nav className="relative p-3 text-gray-500">
        <div className="relative flex items-start justify-between gap-1 pb-3">
          {AREAS.map((area) => (
            <Link
              key={area}
              href={slug ? `/${slug}` : "/"}
              className={cn(
                "rounded-md px-1 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-black/50",
                area === currentArea
                  ? "relative opacity-100"
                  : "pointer-events-none absolute opacity-0",
                area === "default" && "mb-1"
              )}
              aria-hidden={area !== currentArea ? true : undefined}
            >
              {area === "default" ? (
                <Icons.logo className="size-7" />
              ) : (
                <div className="py group -my-1 -ml-1 flex items-center gap-2 py-2 pr-1 text-sm font-medium text-neutral-900">
                  <Icons.chevronLeft className="size-4 text-neutral-500 transition-transform duration-100 group-hover:-translate-x-0.5" />
                  Configurações
                </div>
              )}
            </Link>
          ))}
          <div className="hidden items-center gap-3 md:flex">
            <UserDropdown />
          </div>
        </div>
        <div className="relative w-full">
          {AREAS.map((area) => (
            <Area
              key={area}
              visible={area === currentArea}
              direction={area === "default" ? "left" : "right"}
            >
              {area === "default" && (
                <>
                  <div className="h-px w-full border border-white border-dashed mb-2" />
                  <OrganizationSwitcher />
                </>
              )}

              <div className="flex flex-col gap-4 pt-4">
                {ITEMS[area].map(({ name, items }, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    {name && (
                      <div className="mb-2 pl-1 text-sm text-neutral-500">
                        {name}
                      </div>
                    )}
                    {items({ slug: slug || "" }).map((item) => (
                      <NavItem key={item.name} item={item} />
                    ))}
                  </div>
                ))}
              </div>
            </Area>
          ))}
        </div>
      </nav>
    </ClientOnly>
  );
}
