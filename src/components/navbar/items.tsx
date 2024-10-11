import { Icons, type IconType } from "@/components/icons";
import { Users6 } from "@/components/icons/dub";
import { GearIcon } from "./icons/gear";
import { HomeIcon } from "./icons/home";
import { InventoryIcon } from "./icons/inventory";

export type NavItem = {
  name: string;
  icon: IconType;
  href: string;
  exact?: boolean;
};

export const ITEMS: Record<
  string,
  {
    name?: string;
    items: (args: { slug: string }) => NavItem[];
  }[]
> = {
  // Top-level
  default: [
    {
      items: ({ slug }) => [
        {
          name: "Início",
          icon: HomeIcon,
          href: `/${slug}`,
          exact: true,
        },
        {
          name: "Estoque",
          icon: InventoryIcon,
          href: `/${slug}/inventory`,
        },
        {
          name: "Configurações",
          icon: GearIcon,
          href: `/${slug}/settings`,
        },
      ],
    },
  ],

  // Settings
  settings: [
    {
      name: "Detalhes",
      items: ({ slug }) => [
        {
          name: "Geral",
          icon: Icons.cog,
          href: `/${slug}/settings`,
          exact: true,
        },
        {
          name: "Cobrança",
          icon: Icons.receipt,
          href: `/${slug}/settings/billing`,
        },
        {
          name: "Membros",
          icon: Users6,
          href: `/${slug}/settings/people`,
        },
      ],
    },
  ],
};
