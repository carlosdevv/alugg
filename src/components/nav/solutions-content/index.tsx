import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Link as NavigationMenuLink } from "@radix-ui/react-navigation-menu";

import { Crosshair } from "@/components/icons/custom";
import { Grid } from "@/components/ui/grid";

export const contentHeadingClassName =
  "text-xs uppercase text-neutral-500 dark:text-white/60";

const mainLinks = [
  {
    icon: Crosshair,
    title: "Contratos",
    description:
      "Modelos prontos, organização automatizada e tudo acessível em poucos cliques.",
    // href: "",
  },
  {
    icon: Icons.bag,
    title: "Inventário",
    description:
      "Visualize, adicione e controle todos os itens disponíveis para aluguel em um só lugar.",
    // href: "",
  },
  {
    icon: Icons.users,
    title: "Colaboração",
    description:
      "Adicione membros da equipe e controle permissões com segurança.",
    // href: "",
  },
];

export function SolutionsContent() {
  return (
    <div className="grid w-[1020px] grid-cols-[minmax(0,1fr)] divide-x divide-neutral-200 dark:divide-white/20">
      <div className="flex h-full flex-col p-4">
        <p className="text-xs uppercase text-neutral-500 dark:text-white/60 mb-4 ml-2">
          SOLUÇÕES
        </p>
        <div className="grid grow grid-cols-3 gap-4">
          {mainLinks.map(({ icon: Icon, title, description }) => (
            <NavigationMenuLink key={title} asChild>
              <span
                className={cn(
                  "group relative isolate z-0 flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 px-5 transition-colors duration-75",
                  "dark:border-white/20 dark:bg-neutral-900",
                  "min-h-64 py-8"
                )}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <div className="absolute -inset-[25%] -skew-y-12 [mask-image:linear-gradient(225deg,black,transparent_50%)]">
                    <Grid
                      cellSize={46}
                      patternOffset={[0, -14]}
                      className="translate-y-2 text-[#ad1f3288] transition-transform duration-150 ease-out group-hover:translate-y-0"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute -inset-[10%] opacity-10 blur-[50px] dark:brightness-150",
                      "bg-[conic-gradient(#F35066_0deg,#F35066_117deg,#9071F9_180deg,#5182FC_240deg,#F35066_360deg)]"
                    )}
                  />
                </div>
                <Icon className="relative size-5 text-neutral-700 dark:text-white/60" />
                <div className="relative mt-4">
                  <span className="text-base font-medium text-neutral-900 dark:text-white">
                    {title}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-white/60">
                    {description}
                  </p>
                </div>
              </span>
            </NavigationMenuLink>
          ))}
        </div>
      </div>
    </div>
  );
}
