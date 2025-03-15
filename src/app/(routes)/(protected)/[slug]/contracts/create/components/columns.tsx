"use client";

import { Icons } from "@/components/icons";
import { Badge, type BadgeProps } from "@/components/ui/badge";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import Image from "next/image";
import { ItemHistorySheet } from "./item-history-sheet";

type Status = {
  value: ItemStatus;
  label: string;
  variant: BadgeProps["variant"];
};

export type Item = {
  id: string;
  name: string;
  code: string | null;
  amount: number;
  status: ItemStatus;
  imageUrl: string | null;
  price: number;
  isAvailable?: boolean;
  availableQuantity: number;
  reservations?: Array<{
    eventDate: Date;
    withdrawalDate: Date;
    returnDate: Date;
  }> | null;
};

export const columns: ColumnDef<Item>[] = [
  {
    id: "select",
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
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "amount",
    header: "Quantidade",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span>
          {item.availableQuantity !== undefined
            ? `${item.availableQuantity}/${item.amount}`
            : item.amount}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant={statuses[item.status].variant}>
          {statuses[item.status].label}
        </Badge>
      );
    },
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
    accessorKey: "history",
    header: "Histórico",
    cell: ({ row }) => {
      const item = row.original;

      return <ItemHistorySheet itemId={item.id} itemName={item.name} />;
    },
  },
  {
    id: "availability",
    header: "Disponibilidade",
    cell: ({ row }) => {
      const item = row.original;
      if (item.isAvailable) {
        return <Badge variant="green">Disponível</Badge>;
      }

      return (
        <div className="flex flex-col">
          <Badge variant="rose" className="w-fit">
            Não Disponível
          </Badge>
          {item.reservations && (
            <div className="mt-1 text-xs text-gray-500">
              <p className="font-semibold">Reservado em:</p>
              <ul className="list-disc ml-4">
                {item.reservations.map((reservation, idx) => (
                  <li key={idx}>
                    {formatDateRange(
                      reservation.withdrawalDate,
                      reservation.returnDate
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    },
  },
];

// Função auxiliar para formatar intervalo de datas
const formatDateRange = (start: Date, end: Date) => {
  return `${format(new Date(start), "dd/MM/yyyy", {
    locale: ptBR,
  })} - ${format(new Date(end), "dd/MM/yyyy", { locale: ptBR })}`;
};

const statuses: Record<ItemStatus, Status> = {
  ACTIVE: {
    value: "ACTIVE",
    label: "Ativo",
    variant: "violet",
  },
  INACTIVE: {
    value: "INACTIVE",
    label: "Inativo",
    variant: "rose",
  },
  PENDING: {
    value: "PENDING",
    label: "Pendente",
    variant: "yellow",
  },
  AVALIABLE: {
    value: "AVALIABLE",
    label: "Disponível",
    variant: "green",
  },
  IN_USE: {
    value: "IN_USE",
    label: "Em uso",
    variant: "indigo",
  },
  IN_REPAIR: {
    value: "IN_REPAIR",
    label: "Em reparo",
    variant: "gray",
  },
};
