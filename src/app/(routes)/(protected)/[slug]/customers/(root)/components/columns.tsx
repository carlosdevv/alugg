"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "./row-actions";

export type CustomerColumn = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome do Cliente",
    cell: ({ row }) => {
      const name: string = row.getValue("name") || "-";
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email: string = row.getValue("email") || "-";
      return <div className="font-medium">{email}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: "Celular",
    cell: ({ row }) => {
      const phone: string = row.getValue("phone") || "-";
      return <div className="truncate max-w-60 font-medium">{phone}</div>;
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
