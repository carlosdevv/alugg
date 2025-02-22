"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  selectedItems: Map<string, number>;
  onSelectedItemsChange: (items: Map<string, number>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  selectedItems,
  onSelectedItemsChange,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleSelectAll = (checked: boolean) => {
    const newSelectedItems = new Map(selectedItems);

    if (checked) {
      // Seleciona todos os itens da página atual
      table.getRowModel().rows.forEach((row: any) => {
        if (!newSelectedItems.has(row.original.id)) {
          newSelectedItems.set(row.original.id, 1);
        }
      });
    } else {
      // Remove todos os itens da página atual
      table.getRowModel().rows.forEach((row: any) => {
        newSelectedItems.delete(row.original.id);
      });
    }

    onSelectedItemsChange(newSelectedItems);
  };

  const handleRowSelectionChange = (row: any) => {
    const itemId = row.original.id;
    const newSelectedItems = new Map(selectedItems);

    if (selectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.set(itemId, 1);
    }

    onSelectedItemsChange(newSelectedItems);
  };

  const table = useReactTable({
    data,
    columns: columns.map((col) => {
      if (col.id === "select") {
        return {
          ...col,
          header: () => {
            const pageRowIds =
              table?.getRowModel().rows.map((row: any) => row.original.id) ||
              [];
            const pageRowsSelected = pageRowIds.every((id) =>
              selectedItems.has(id)
            );

            return (
              <Checkbox
                checked={pageRowsSelected}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                aria-label="Select all"
              />
            );
          },
          cell: (props) => (
            <Checkbox
              checked={selectedItems.has((props.row.original as any).id)}
              onCheckedChange={() => handleRowSelectionChange(props.row)}
              aria-label="Select row"
            />
          ),
        } as ColumnDef<TData, any>;
      }
      return col;
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex flex-wrap gap-y-4 justify-between items-center py-4">
        <div className="flex items-center gap-x-4">
          <Input
            placeholder="Buscar por Nome"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-60"
          />
          <Input
            placeholder="Buscar por Código"
            value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("code")?.setFilterValue(event.target.value)
            }
            className="max-w-60"
          />
        </div>
        <Button type="button" variant="secondary" size="sm" asChild>
          <Link href={appRoutes.items.create}>
            <Icons.circlePlus className="size-4 mr-2" />
            Novo Item
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
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
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
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Anterior</span>
            <Icons.chevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Próximo</span>
            <Icons.chevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
