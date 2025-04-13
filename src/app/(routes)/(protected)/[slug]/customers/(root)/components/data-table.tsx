"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { appRoutes } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: {
    pageCount: number;
    pageSize: number;
    page: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  toolbar?: {
    onCustomerNameChange?: (name: string) => void;
    customerName?: string;
    isLoading?: boolean;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  toolbar,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: pagination.pageCount,
    state: {
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const nextState = updater({
          pageIndex: pagination.page - 1,
          pageSize: pagination.pageSize,
        });
        pagination.onPageChange(nextState.pageIndex + 1);
      }
    },
  });

  return (
    <div>
      <div className="flex flex-wrap gap-y-4 justify-between items-center py-4">
        <div className="relative w-[150px] lg:w-[250px]">
          <Input
            placeholder="Buscar por Nome"
            value={toolbar?.customerName}
            onChange={(event) =>
              toolbar?.onCustomerNameChange?.(event.target.value)
            }
            className="pr-8"
          />
          {toolbar?.isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Icons.loader className="size-4 animate-spin" />
            </div>
          )}
        </div>
        <Button size="sm" asChild>
          <Link href={appRoutes.customers.create}>
            <Icons.circlePlus className="size-4 mr-2" />
            Adicionar Cliente
          </Link>
        </Button>
      </div>
      <div className="rounded-md border mb-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Resultados não encontrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex items-center gap-x-6 lg:gap-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Items por página</p>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => {
              pagination.onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto flex w-[100px] items-center justify-center text-sm font-medium">
          Página {pagination.page} de {pagination.pageCount}
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="size-8 p-0"
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <span className="sr-only">Anterior</span>
            <Icons.chevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-8 p-0"
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pageCount}
          >
            <span className="sr-only">Próximo</span>
            <Icons.chevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
