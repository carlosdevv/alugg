import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { appRoutes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Table, type Column } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onStatusChange?: (status: string[]) => void;
  onResetFilters?: () => void;
  onCustomerNameChange?: (name: string) => void;
  customerName?: string;
  isLoading?: boolean;
}

const statuses = [
  { value: "OPEN", label: "Aberto" },
  {
    value: "CLOSED",
    label: "Fechado",
  },
  {
    value: "CANCELLED",
    label: "Cancelado",
  },
  {
    value: "COLLECTED",
    label: "Retirado",
  },
];

export function DataTableToolbar<TData>({
  table,
  onStatusChange,
  onResetFilters,
  onCustomerNameChange,
  customerName,
  isLoading,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleResetFilters = () => {
    table.resetColumnFilters();
    onStatusChange?.([]);
    onResetFilters?.();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="relative w-[150px] lg:w-[250px]">
          <Input
            placeholder="Filtrar por nome do cliente..."
            value={customerName}
            onChange={(event) => onCustomerNameChange?.(event.target.value)}
            className="h-8 pr-8"
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Icons.loader className="size-4 animate-spin" />
            </div>
          )}
        </div>
        <div className="flex gap-x-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
              onSelectionChange={onStatusChange}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <Icons.x className="ml-1 size-4" />
          </Button>
        )}
      </div>
      <Button size="sm" onClick={() => router.push(appRoutes.contracts.create)}>
        <Icons.circlePlus className="mr-2 size-4" />
        Novo Contrato
      </Button>
    </div>
  );
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onSelectionChange?: (values: string[]) => void;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  onSelectionChange,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const handleSelectionChange = (value: string) => {
    if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }
    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
    onSelectionChange?.(filterValues);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Icons.circlePlus className="mr-2 size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 1 ? (
                  <div className="rounded-sm border-dashed border px-1.5 py-0.5 font-normal">
                    {selectedValues.size} selecionados
                  </div>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <div
                        key={option.value}
                        className="rounded-sm px-1.5 py-0.5 text-xs font-semibold"
                      >
                        {option.label}
                      </div>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelectionChange(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Icons.check className="size-4" />
                    </div>
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined);
                      onSelectionChange?.([]);
                    }}
                    className="cursor-pointer justify-center text-center"
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
