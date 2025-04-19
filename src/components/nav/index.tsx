"use client";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/dub-button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useScroll } from "@/hooks/use-scroll";
import { appRoutes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { LayoutGroup } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, type PropsWithChildren, type SVGProps } from "react";
import { ResourcesContent } from "./resources-content";
import { SolutionsContent } from "./solutions-content";

export const navItems = [
  {
    name: "Soluções",
    content: SolutionsContent,
    segments: [appRoutes.solutions],
  },
  {
    name: "Recursos",
    content: ResourcesContent,
    segments: [appRoutes.resources],
  },
  {
    name: "Planos",
    href: appRoutes.plans,
    segments: [appRoutes.plans],
  },
];

const navItemClassName = cn(
  "relative group/item flex items-center rounded-md px-4 py-2 text-sm rounded-lg font-medium text-neutral-700 hover:text-neutral-900 transition-colors",
  "dark:text-white/90 dark:hover:text-white",
  "hover:bg-neutral-900/5 dark:hover:bg-white/10",
  "data-[active=true]:bg-neutral-900/5 dark:data-[active=true]:bg-white/10",

  // Hide active state when another item is hovered
  "group-has-[:hover]:data-[active=true]:[&:not(:hover)]:bg-transparent"
);

export default function Nav() {
  const pathname = usePathname();
  const layoutGroupId = useId();
  const scrolled = useScroll(40);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center">
        <LayoutGroup id={layoutGroupId}>
          <div className="sticky inset-x-0 top-0 z-30 w-full transition-all">
            {/* Scrolled background */}
            <div
              className={cn(
                "absolute inset-0 block border-b border-transparent transition-all",
                scrolled &&
                  "border-neutral-100 bg-white/75 backdrop-blur-lg dark:border-white/10 dark:bg-black/75"
              )}
            />
            <div className="relative mx-auto w-full max-w-screen-xl">
              <div className="flex h-14 items-center justify-between">
                {/* Logo */}
                <div className="flex flex-1 items-center justify-start">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
                      A
                    </div>
                    <span className="font-bold">Alugg</span>
                  </Link>
                </div>

                <NavigationMenuPrimitive.Root
                  delayDuration={0}
                  className="relative hidden lg:block"
                >
                  <NavigationMenuPrimitive.List className="group relative z-0 flex">
                    {navItems.map(
                      ({ name, href, segments, content: Content }) => {
                        const isActive = segments.some((segment) =>
                          pathname?.startsWith(segment)
                        );
                        return (
                          <NavigationMenuPrimitive.Item key={name}>
                            <WithTrigger trigger={!!Content}>
                              {href !== undefined ? (
                                <Link
                                  id={`nav-${href}`}
                                  href={href}
                                  className={navItemClassName}
                                  data-active={isActive}
                                >
                                  {name}
                                </Link>
                              ) : (
                                <button
                                  className={navItemClassName}
                                  data-active={isActive}
                                >
                                  {name}
                                  <AnimatedChevron className="ml-1.5 size-2.5 text-neutral-700" />
                                </button>
                              )}
                            </WithTrigger>

                            {Content && (
                              <NavigationMenuPrimitive.Content className="data-[motion=from-start]:animate-enter-from-left data-[motion=from-end]:animate-enter-from-right data-[motion=to-start]:animate-exit-to-left data-[motion=to-end]:animate-exit-to-right absolute left-0 top-0">
                                <Content />
                              </NavigationMenuPrimitive.Content>
                            )}
                          </NavigationMenuPrimitive.Item>
                        );
                      }
                    )}
                  </NavigationMenuPrimitive.List>

                  <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2">
                    <NavigationMenuPrimitive.Viewport
                      className={cn(
                        "relative flex origin-[top_center] justify-start overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-md dark:border-white/[0.15] dark:bg-black",
                        "data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content",
                        "h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] transition-[width,height]"
                      )}
                    />
                  </div>
                </NavigationMenuPrimitive.Root>

                <div className="hidden grow basis-0 justify-end gap-2 lg:flex">
                  <Link
                    href={appRoutes.signIn}
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "flex h-8 items-center rounded-lg border px-4 text-sm"
                    )}
                  >
                    Login
                  </Link>
                  <Link
                    href={appRoutes.signUp}
                    className={cn(
                      buttonVariants({ variant: "primary" }),
                      "flex h-8 items-center rounded-lg border px-4 text-sm"
                    )}
                  >
                    Inscreva-se
                    <Icons.arrowRight className="ml-2 size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </LayoutGroup>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Menu Mobile */}
          <Sheet>
            <SheetTrigger className="lg:hidden" aria-label="Menu">
              <Icons.menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0">
              <div className="flex h-full flex-col">
                <div className="border-b px-7 py-4">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
                      A
                    </div>
                    <span className="font-bold">Alugg</span>
                  </Link>
                </div>
                <nav className="flex-1 px-4 py-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Produto</h4>
                      <div className="space-y-3">
                        <Link
                          href="/plataforma"
                          className="block text-foreground/60"
                        >
                          Plataforma
                        </Link>
                        <Link
                          href="/recursos"
                          className="block text-foreground/60"
                        >
                          Recursos
                        </Link>
                        <Link
                          href="/integracoes"
                          className="block text-foreground/60"
                        >
                          Integrações
                        </Link>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Soluções</h4>
                      <div className="space-y-3">
                        <Link
                          href="/proprietarios"
                          className="block text-foreground/60"
                        >
                          Para Proprietários
                        </Link>
                        <Link
                          href="/imobiliarias"
                          className="block text-foreground/60"
                        >
                          Para Imobiliárias
                        </Link>
                        <Link
                          href="/administradoras"
                          className="block text-foreground/60"
                        >
                          Para Administradoras
                        </Link>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Recursos</h4>
                      <div className="space-y-3">
                        <Link href="/blog" className="block text-foreground/60">
                          Blog
                        </Link>
                        <Link
                          href="/tutoriais"
                          className="block text-foreground/60"
                        >
                          Tutoriais
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>
                <div className="border-t px-7 py-4">
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="text-sm text-foreground/60 transition-colors hover:text-foreground/80"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/cadastro"
                      className="rounded-full bg-foreground px-4 py-1.5 text-sm text-background text-center hover:bg-foreground/90"
                    >
                      Cadastre-se
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function AnimatedChevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      fill="none"
      viewBox="0 0 9 9"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.278 3.389 4.5 6.167 1.722 3.389"
        className="transition-transform duration-150 [transform-box:view-box] [transform-origin:center] [vector-effect:non-scaling-stroke] group-data-[state=open]/item:-scale-y-100"
      />
    </svg>
  );
}

function WithTrigger({
  trigger,
  children,
}: PropsWithChildren<{ trigger: boolean }>) {
  return trigger ? (
    <NavigationMenuPrimitive.Trigger asChild>
      {children}
    </NavigationMenuPrimitive.Trigger>
  ) : (
    children
  );
}
