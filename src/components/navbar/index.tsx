import Link from "next/link";

import { Icons } from "@/components/icons";
import { NavLink } from "@/components/nav-link";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { appRoutes } from "@/lib/constants";
import { getCookie } from "cookies-next";
import SignOutButton from "./sign-out-button";

export default function Navbar() {
  const currentOrg = getCookie("org");
  
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href={appRoutes.home}
            className="flex items-center gap-2 font-semibold"
          >
            <Icons.logo className="size-5" color="#0e0f10" />
            <OrganizationSwitcher currentOrg={currentOrg} />
          </Link>
        </div>
        <div className="flex-1">
          {currentOrg && (
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink
                href={appRoutes.home}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary data-[current=true]:bg-muted"
              >
                <Icons.home className="h-4 w-4" />
                Inicio
              </NavLink>
              <NavLink
                href={appRoutes.inventory.root}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary data-[current=true]:bg-muted"
              >
                <Icons.package className="h-4 w-4" />
                Estoque
              </NavLink>
            </nav>
          )}
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
