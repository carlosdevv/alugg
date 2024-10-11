import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { type NavItem as NavItemType } from "./items";

export function NavItem({ item }: { item: NavItemType }) {
  const { name, icon: Icon, href, exact } = item;

  const [hovered, setHovered] = useState(false);

  const pathname = usePathname();

  const isActive = useMemo(() => {
    return exact ? pathname === href : pathname.startsWith(href);
  }, [pathname, href, exact]);

  return (
    <Link
      href={href}
      data-active={isActive}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn(
        "group flex items-center gap-2.5 rounded-md p-2 text-sm leading-none text-neutral-600 transition-[background-color,color,font-weight] duration-75 hover:bg-neutral-200/50 active:bg-neutral-200/80",
        "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
        isActive &&
          "bg-indigo-100/50 font-medium text-indigo-900 hover:bg-indigo-100/80 active:bg-indigo-100"
      )}
    >
      <Icon
        className="size-4 text-neutral-500 transition-colors duration-75 group-data-[active=true]:text-indigo-900"
        data-hovered={hovered}
      />
      {name}
    </Link>
  );
}
