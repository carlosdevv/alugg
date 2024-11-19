"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { PageWrapper } from "./page-wrapper";

type PageContentProps = {
  title?: ReactNode;
  children: ReactNode;
  hasBackButton?: boolean;
};
export function PageContent({
  title,
  children,
  hasBackButton,
}: PageContentProps) {
  const router = useRouter();
  const hasTitle = title !== undefined;

  return (
    <>
      <SidebarInset>
        <PageWrapper className={cn("mt-3", hasTitle && "md:mt-6 md:py-3")}>
          <header className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="size-5 md:hidden" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 md:hidden"
              />
              {hasBackButton && (
                <Button size="sm" variant="ghost" onClick={() => router.back()}>
                  <Icons.chevronLeft className="size-4" />
                </Button>
              )}
              {hasTitle && (
                <h1 className="text-xl font-semibold leading-7 dark:text-neutral-100 text-neutral-900 md:text-2xl">
                  {title}
                </h1>
              )}
            </div>
          </header>
        </PageWrapper>
        {children}
      </SidebarInset>
    </>
  );
}
