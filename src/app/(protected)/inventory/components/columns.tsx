"use client";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type StockItems = {
  id: string;
  name: string;
  category: string;
  code?: string;
  objectPrice: number;
  rentPrice: number;
  size?: string;
  color?: string;
  description?: string;
  amount: number;
  imageUrl?: string;
};

export const columns: ColumnDef<StockItems>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mr-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
              <Avatar className="size-16">
                <AvatarImage src={imageUrl} />
                <AvatarFallback>
                  <Icons.image className="size-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="w-full flex">
              <div className="flex items-center justify-center bg-muted size-16 rounded-full">
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
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "objectPrice",
    header: "Preço de objeto",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("objectPrice"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "rentPrice",
    header: "Preço de aluguel",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("rentPrice"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "size",
    header: "Tamanho",
  },
  {
    accessorKey: "color",
    header: "Cor",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "amount",
    header: "Quantidade",
  },
  {
    header: "Opções",
  },
];
