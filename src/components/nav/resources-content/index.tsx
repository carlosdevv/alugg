import { type IconType } from "@/components/icons";
import { appRoutes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link as NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";

const mainLinks = [
  {
    title: "Docs",
    description: "Documentação detalhada para o Alugg",
    thumbnail: "https://assets.dub.co/misc/help-thumbnail.jpg", // TODO: Update
    href: appRoutes.docs,
    disabled: true,
  },
  {
    title: "Central de Ajuda",
    description: "Respostas para suas perguntas",
    thumbnail: "https://assets.dub.co/misc/help-thumbnail.jpg", // TODO: Update
    href: appRoutes.help,
    disabled: true,
  },
];

export function ResourcesContent() {
  return (
    <div className="grid w-[720px] grid-cols-[minmax(0,1fr)] divide-x divide-neutral-200 dark:divide-white/20">
      <div className="grid grid-cols-2 gap-4 p-4">
        {mainLinks.map(({ title, description, thumbnail, href, disabled }) => (
          <NavigationMenuLink key={title} asChild>
            <div
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 transition-colors duration-75 hover:bg-neutral-100/80",
                "dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15",
                "min-h-80"
              )}
            >
              <div className="p-5 pb-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {title}
                  </span>
                  {disabled && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-white/20 dark:text-white/70">
                      Em breve
                    </span>
                  )}
                </div>
                <p className="mt-3 max-w-56 text-sm text-neutral-500 dark:text-white/60">
                  {description}
                </p>
              </div>
              <div className="relative mt-7 grow overflow-hidden pl-5 [mask-image:linear-gradient(90deg,black_50%,transparent)]">
                <div
                  className={cn(
                    "relative size-full overflow-hidden rounded-tl-lg border-l border-t border-black/10",
                    "[mask-image:linear-gradient(black_50%,transparent)]"
                  )}
                >
                  <Image
                    src={thumbnail}
                    alt={`${title} thumbnail`}
                    fill
                    className="bg-white object-cover object-left-top grayscale transition-[filter] duration-75 group-hover:grayscale-0 dark:opacity-50"
                  />
                </div>
              </div>
              {!disabled && <Link href={href} className="absolute inset-0" />}
            </div>
          </NavigationMenuLink>
        ))}
      </div>
    </div>
  );
}

export function LargeLinkCard({
  icon: Icon,
  title,
  description,
  iconClassName,
  disabled,
  ...rest
}: {
  icon: IconType;
  title: string;
  description?: string;
  iconClassName?: string;
  disabled?: boolean;
} & ComponentProps<typeof Link>) {
  return (
    <NavigationMenuLink asChild>
      <div
        className={cn(
          "group relative flex flex-col justify-center rounded-xl border border-neutral-100 bg-neutral-50 transition-colors duration-150 hover:bg-neutral-100 active:bg-neutral-200 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15 dark:active:bg-white/20",
          disabled && "cursor-not-allowed opacity-80"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium leading-none text-neutral-900 dark:text-white">
                {title}
              </span>
              {disabled && (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-white/20 dark:text-white/70">
                  Em breve
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-neutral-500 dark:text-white/60">
              {description}
            </p>
          </div>
          <Icon
            className={cn(
              "size-6 text-neutral-700 dark:text-neutral-200",
              iconClassName
            )}
          />
        </div>
        {!disabled && <Link {...rest} className="absolute inset-0" />}
      </div>
    </NavigationMenuLink>
  );
}
