"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";

interface DataTableToolbarProps {
  onCategoryNameChange?: (name: string) => void;
  onResetFilters?: () => void;
  categoryName?: string;
  isLoading?: boolean;
}

export function DataTableToolbar({
  onCategoryNameChange,
  onResetFilters,
  categoryName,
  isLoading,
}: DataTableToolbarProps) {
  const [, setModal] = useQueryState("modal");
  const isFiltered = !!categoryName;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="relative w-[150px] lg:w-[250px]">
          <Input
            placeholder="Filtrar por nome..."
            value={categoryName}
            onChange={(event) => onCategoryNameChange?.(event.target.value)}
            className="h-8 pr-8"
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Icons.loader className="size-4 animate-spin" />
            </div>
          )}
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
      <Button size="sm" onClick={() => setModal("create-category")}>
        <Icons.circlePlus className="mr-2 size-4" />
        Criar Categoria
      </Button>
    </div>
  );
}
