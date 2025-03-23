"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetContractsService } from "@/http/contracts/use-contracts-service";
import { useMemo } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type ContractsPageClientProps = {
  slug: string;
};

export default function ContractsPageClient({
  slug,
}: ContractsPageClientProps) {
  const { data: contracts, isLoading } = useGetContractsService({ slug });

  const formattedContracts = useMemo(() => {
    return contracts?.data.map((contract) => ({
      ...contract,
      customerName: contract.customer.name,
      customerPhone: contract.customer.phone,
      contractDocuments: contract.contractDocuments
    }));
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
      <DataTable columns={columns} data={formattedContracts ?? []} />
    </>
  );
}
