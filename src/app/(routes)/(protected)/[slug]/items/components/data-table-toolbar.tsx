"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/lib/constants";
import Link from "next/link";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps {
  onStatusChange?: (status: string[]) => void;
  onResetFilters?: () => void;
  onItemNameChange?: (name: string) => void;
  itemName?: string;
  isLoading?: boolean;
  status?: string[];
}

const statusOptions = [
  {
    value: "ACTIVE",
    label: "Ativo",
  },
  {
    value: "INACTIVE",
    label: "Inativo",
  },
];

export function DataTableToolbar({
  onStatusChange,
  onResetFilters,
  onItemNameChange,
  itemName,
  isLoading,
  status,
}: DataTableToolbarProps) {
  const isFiltered = !!(status?.length || itemName);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="relative w-[150px] lg:w-[250px]">
          <Input
            placeholder="Filtrar por nome..."
            value={itemName}
            onChange={(event) => onItemNameChange?.(event.target.value)}
            className="h-8 pr-8"
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Icons.loader className="size-4 animate-spin" />
            </div>
          )}
        </div>
        <div className="flex gap-x-2">
          <DataTableFacetedFilter
            options={statusOptions}
            title="Status"
            value={status}
            onSelectionChange={onStatusChange}
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <Icons.x className="ml-1 size-4" />
          </Button>
        )}
      </div>
      <Button size="sm" asChild>
        <Link href={appRoutes.items.create}>
          <Icons.circlePlus className="mr-2 size-4" />
          Criar Item
        </Link>
      </Button>
    </div>
  );
}
