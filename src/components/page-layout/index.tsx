import { cn } from "@/lib/utils";
import type { PropsWithChildren, ReactNode } from "react";
import UserDropdown from "../navbar/user-dropdown";
import { NavButton } from "./nav-button";
import { PageWrapper } from "./page-wrapper";

export function PageContent({
  title,
  children,
}: PropsWithChildren<{ title?: ReactNode }>) {
  const hasTitle = title !== undefined;

  return (
    <div className="bg-neutral-100 md:bg-white">
      <PageWrapper className={cn("mt-3", hasTitle && "md:mt-6 md:py-3")}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <NavButton />
            {hasTitle && (
              <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                {title}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <UserDropdown />
          </div>
        </div>
      </PageWrapper>
      <div className="bg-white pt-2.5 max-md:mt-3 max-md:rounded-t-[16px]">
        {children}
      </div>
    </div>
  );
}
