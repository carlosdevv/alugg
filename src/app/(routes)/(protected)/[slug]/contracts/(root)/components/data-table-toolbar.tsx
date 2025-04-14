import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/lib/constants";
import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

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
