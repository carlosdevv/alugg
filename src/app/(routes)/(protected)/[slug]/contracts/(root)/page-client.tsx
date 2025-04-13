"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetContractsService } from "@/http/contracts/use-contracts-service";
import type { ContractStatus } from "@prisma/client";
import { useMemo, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type ContractsPageClientProps = {
  slug: string;
};

export default function ContractsPageClient({
  slug,
}: ContractsPageClientProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [debouncedCustomerName] = useDebounce(customerName, 500);

  const { data: contracts, isLoading } = useGetContractsService(
    {
      slug,
      page,
      limit: pageSize,
      status:
        selectedStatus.length > 0
          ? (selectedStatus as ContractStatus[])
          : undefined,
      customerName: debouncedCustomerName || undefined,
    },
    {
      enabled: !!slug,
      queryKey: [
        "getContracts",
        slug,
        page,
        pageSize,
        selectedStatus,
        debouncedCustomerName,
      ],
      initialData: {
        data: [],
        count: {
          total: 0,
          open: 0,
          collected: 0,
          closed: 0,
          cancelled: 0,
        },
        pagination: {
          total: 0,
          pages: 0,
          page: 1,
          limit: 10,
        },
      },
    }
  );

  const formattedContracts = useMemo(() => {
    return (
      contracts?.data.map((contract) => ({
        ...contract,
        customerName: contract.customer.name,
        customerPhone: contract.customer.phone,
        contractDocuments: contract.contractDocuments,
      })) ?? []
    );
  }, [contracts]);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-8">
        <div className="flex flex-wrap gap-x-2">
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
        </div>
        <Skeleton className="w-full h-52 rounded-md" />
      </div>
    );
  }

  // Garantir que temos valores padrão seguros para a paginação
  const paginationData = {
    pageCount: contracts?.pagination?.pages ?? 0,
    pageSize,
    page,
    onPageChange: (newPage: number) => {
      setPage(newPage);
    },
    onPageSizeChange: (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1); // Resetar para primeira página quando mudar o tamanho
    },
  };

  const handleStatusChange = (newStatus: string[]) => {
    setSelectedStatus(newStatus);
    setPage(1); // Resetar para primeira página ao mudar o filtro
  };

  const handleCustomerNameChange = (name: string) => {
    setCustomerName(name);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedStatus([]);
    setCustomerName("");
    setPage(1);
  };

  return (
    <>
      <div className="flex flex-wrap gap-y-4 items-center space-x-4 text-xs">
        <Badge variant="gray" className="space-x-2">
          <span className="uppercase">Total</span>
          <span>{contracts?.count.total ?? 0}</span>
        </Badge>

        <Badge variant="yellow" className="space-x-2">
          <span className="uppercase">Em Aberto</span>
          <span>{contracts?.count.open ?? 0}</span>
        </Badge>

        <Badge variant="green" className="space-x-2">
          <span className="uppercase">Retirado</span>
          <span>{contracts?.count.collected ?? 0}</span>
        </Badge>

        <Badge variant="indigo" className="space-x-2">
          <span className="uppercase">Finalizado</span>
          <span>{contracts?.count.closed ?? 0}</span>
        </Badge>
      </div>
      <DataTable
        columns={columns}
        data={formattedContracts}
        pagination={paginationData}
        toolbar={{
          onStatusChange: handleStatusChange,
          onResetFilters: handleResetFilters,
          onCustomerNameChange: handleCustomerNameChange,
          customerName,
          isLoading,
        }}
      />
    </>
  );
}
