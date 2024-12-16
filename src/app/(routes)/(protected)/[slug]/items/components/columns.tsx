"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelRoot,
  FloatingPanelTrigger,
} from "@/components/ui/floating-panel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import Image from "next/image";
import { RowActions } from "./row-actions";

export type ItemColumn = {
  id: string;
  name: string;
  category: {
    name: string;
  };
  code?: string;
  objectPrice: number;
  rentPrice: number;
  size?: string;
  color?: string;
  description?: string;
  amount: number;
  imageUrl?: string;
  status: string;
};

export const columns: ColumnDef<ItemColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: "Imagem",
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      return (
        <>
          {imageUrl ? (
            <div className="w-full flex">
              <FloatingPanelRoot>
                <FloatingPanelTrigger title="Imagem do Item" asChild>
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    width="64"
                    src={imageUrl}
                  />
                </FloatingPanelTrigger>
                <FloatingPanelContent className="w-80">
                  <FloatingPanelBody>
                    <motion.img
                      src={imageUrl}
                      alt="image"
                      className="w-full h-auto rounded-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </FloatingPanelBody>
                  <FloatingPanelFooter>
                    <FloatingPanelCloseButton />
                  </FloatingPanelFooter>
                </FloatingPanelContent>
              </FloatingPanelRoot>
            </div>
          ) : (
            <div className="w-full flex">
              <div className="flex items-center justify-center size-16 bg-muted aspect-square rounded-md object-cover">
                <Icons.image className="size-6 text-muted-foreground" />
              </div>
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => {
      const code: string = row.getValue("code") || "-";
      return <div className="font-medium">{code}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const category = row.getValue("category") as { name: string };
      return (
        <div className="truncate max-w-60 font-medium">{category?.name}</div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      return (
        <div className="truncate max-w-60 font-medium">
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Quantidade",
  },
  {
    accessorKey: "objectPrice",
    header: "Preço do Objeto",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("objectPrice"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "rentPrice",
    header: "Preço de Aluguel",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("rentPrice"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: boolean = row.getValue("status") === "ACTIVE";
      return (
        <Badge
          className={cn(
            status
              ? "bg-emerald-400 hover:bg-emerald-500"
              : "bg-rose-500 hover:bg-rose-600",
            "font-medium text-primary"
          )}
        >
          {status ? "ATIVO" : "INATIVO"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Tamanho",
    cell: ({ row }) => {
      const size: string = row.getValue("size") || "-";
      return <div className="font-medium">{size}</div>;
    },
  },
  {
    accessorKey: "color",
    header: "Cor",
    cell: ({ row }) => {
      const color: string = row.getValue("color") || "-";
      return <div className="font-medium">{color}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description: string = row.getValue("description") || "-";
      return (
        <>
          {description === "-" ? (
            <div>-</div>
          ) : (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="p-0">
                  Ver descrição
                </Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex flex-col space-y-2">
                  <h1 className="font-medium">Descrição</h1>
                  {description}
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </>
      );
    },
  },

  {
    header: "Opções",
    cell: ({ row }) => {
      return <RowActions row={row} />;
    },
  },
];
