"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "./row-actions";

export type InventoryItemColumn = {
  id: string;
  name: string;
  totalItems: number;
};

export const columns: ColumnDef<InventoryItemColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome da Categoria",
    cell: ({ row }) => {
      return (
        <div className="truncate max-w-xs font-medium text-gray-800 hover:text-blue-600 transition-colors">
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "totalItems",
    header: "Total de Itens Vinculados",
    cell: ({ row }) => {
      const totalItems = row.getValue("totalItems");
      return (
        <div className="text-gray-600">{totalItems?.toLocaleString()}</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div className="flex justify-end pr-2">Opções</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-4">
          <RowActions row={row} />
        </div>
      );
    },
  },
];
