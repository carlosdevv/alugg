"use client";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatToCurrency } from "@/lib/utils";
import type { ContractStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { RowActions } from "./row-actions";

export type ContractColumn = {
  id: string;
  code: number;
  customerName: string;
  customerPhone: string;
  eventDate: Date;
  withdrawalDate: Date;
  returnDate: Date;
  status: ContractStatus;
  totalValue: number;
  pendingDebt: number;
  createdAt: Date;
  contractDocuments: {
    url: string;
    type: string;
  }[];
};

export const columns: ColumnDef<ContractColumn>[] = [
  {
    accessorKey: "code",
    header: () => <div className="text-center">Código</div>,
    cell: ({ row }) => {
      const code: string = row.getValue("code") || "-";
      return (
        <div className="font-medium text-center">
          {code.toString().padStart(2, "0")}
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Cliente",
    cell: ({ row }) => {
      const customerName: string = row.getValue("customerName") || "-";
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium truncate max-w-[200px]">
                {customerName}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{customerName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "customerPhone",
    header: "Telefone",
    cell: ({ row }) => {
      const phone: string = row.getValue("customerPhone") || "-";
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium truncate max-w-[150px]">{phone}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{phone}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "eventDate",
    header: () => <div className="text-center">Data do Evento</div>,
    cell: ({ row }) => {
      const eventDate: Date = row.getValue("eventDate") || new Date();
      return (
        <div className="font-medium text-center">
          {format(new Date(eventDate), "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "withdrawalDate",
    header: () => <div className="text-center">Data de Retirada</div>,
    cell: ({ row }) => {
      const withdrawalDate: Date = row.getValue("withdrawalDate") || new Date();
      return (
        <div className="font-medium text-center">
          {format(new Date(withdrawalDate), "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "returnDate",
    header: () => <div className="text-center">Data de Devolucao</div>,
    cell: ({ row }) => {
      const returnDate: Date = row.getValue("returnDate") || new Date();
      return (
        <div className="font-medium text-center">
          {format(new Date(returnDate), "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status: ContractStatus = row.getValue("status") || "OPEN";
      return (
        <div className="flex justify-center">
          <Badge variant={statusColors[status]} className="font-medium">
            {statusText[status]}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "pendingDebt",
    header: () => <div className="text-center">Valor Pendente</div>,
    cell: ({ row }) => {
      const pendingDebt: number = row.getValue("pendingDebt") || 0;
      return (
        <div
          className={cn(
            "font-medium text-center",
            pendingDebt > 0 && "text-rose-500",
            pendingDebt === 0 && "text-emerald-500"
          )}
        >
          {formatToCurrency(pendingDebt)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalValue",
    header: () => <div className="text-center">Valor Total</div>,
    cell: ({ row }) => {
      const totalValue: number = row.getValue("totalValue") || 0;
      return (
        <div className="font-medium text-center">
          {formatToCurrency(totalValue)}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div className="text-center">Opções</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <RowActions row={row} />
        </div>
      );
    },
  },
];

const statusColors: Record<ContractStatus, BadgeProps["variant"]> = {
  OPEN: "yellow",
  CLOSED: "indigo",
  CANCELLED: "rose",
  COLLECTED: "green",
};

const statusText: Record<ContractStatus, string> = {
  OPEN: "Aberto",
  CLOSED: "Finalizado",
  CANCELLED: "Cancelado",
  COLLECTED: "Retirado",
};
