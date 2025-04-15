import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center px-4">
        {/* Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
              A
            </div>
            <span className="font-bold">Alugg</span>
          </Link>
        </div>

        {/* Menu de navegação - Desktop */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Produto</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-64">
                  <li className="row-span-3">
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md"
                      href="/plataforma"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Plataforma Alugg
                      </div>
                      <p className="text-sm leading-tight text-gray-600">
                        Gerencie seus aluguéis com facilidade e eficiência.
                      </p>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/recursos"
                      className={navigationMenuTriggerStyle()}
                    >
                      Recursos
                    </a>
                  </li>
                  <li>
                    <a
                      href="/integracoes"
                      className={navigationMenuTriggerStyle()}
                    >
                      Integrações
                    </a>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Soluções</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-64">
                  <li>
                    <a
                      href="/proprietarios"
                      className={navigationMenuTriggerStyle()}
                    >
                      Para Proprietários
                    </a>
                  </li>
                  <li>
                    <a
                      href="/imobiliarias"
                      className={navigationMenuTriggerStyle()}
                    >
                      Para Imobiliárias
                    </a>
                  </li>
                  <li>
                    <a
                      href="/administradoras"
                      className={navigationMenuTriggerStyle()}
                    >
                      Para Administradoras
                    </a>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-64">
                  <li>
                    <a href="/blog" className={navigationMenuTriggerStyle()}>
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/tutoriais"
                      className={navigationMenuTriggerStyle()}
                    >
                      Tutoriais
                    </a>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/empresa" className={navigationMenuTriggerStyle()}>
                Empresa
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/precos" className={navigationMenuTriggerStyle()}>
                Preços
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Botões de ação */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link
            href="/login"
            className="hidden text-sm text-foreground/60 transition-colors hover:text-foreground/80 sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="hidden rounded-full bg-foreground px-4 py-1.5 text-sm text-background hover:bg-foreground/90 sm:block"
          >
            Cadastre-se
          </Link>

          {/* Menu Mobile */}
          <Sheet>
            <SheetTrigger className="lg:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
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
