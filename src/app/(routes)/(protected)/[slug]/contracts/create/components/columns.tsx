"use client";

import { Icons } from "@/components/icons";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelRoot,
  FloatingPanelTrigger,
} from "@/components/ui/floating-panel";
import type { ItemStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import Image from "next/image";

export type CreateContractColumn = {
  id: string;
  imageUrl?: string;
  name: string;
  amount: number;
  status: ItemStatus;
  code?: string;
  price: number;
};

export const columns: ColumnDef<CreateContractColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "price",
    header: "Preço de Aluguel",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
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
      const status: ItemStatus = row.getValue("status") || "ACTIVE";
      return (
        <div className="flex justify-center">
          <Badge variant={statusVariant[status]} className="uppercase">
            {statusText[status]}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "disponibility",
    header: "Disponibilidade",
    cell: ({ row }) => {
      return <Badge variant="green">DISPONIVEL</Badge>;
    },
  },
  {
    accessorKey: "history",
    header: "Histórico",
  },
  {
    accessorKey: "events",
    header: "Eventos",
  },
];

const statusVariant: Record<ItemStatus, BadgeProps["variant"]> = {
  ACTIVE: "violet",
  INACTIVE: "rose",
  PENDING: "yellow",
  AVALIABLE: "green",
  IN_USE: "indigo",
  IN_REPAIR: "gray",
};

const statusText: Record<ItemStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  PENDING: "Pendente",
  AVALIABLE: "Disponível",
  IN_USE: "Em uso",
  IN_REPAIR: "Em reparo",
};
