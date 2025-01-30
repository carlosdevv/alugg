"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetContractsService } from "@/http/contracts/use-contracts-service";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type ContractsPageClientProps = {
  slug: string;
};

export default function ContractsPageClient({
  slug,
}: ContractsPageClientProps) {
  const { data: contracts, isLoading } = useGetContractsService({ slug });

  const formattedContracts = contracts
    ? contracts.data.map((contract) => ({
        id: contract.id,
        code: contract.code,
        name: contract.name,
        status: contract.status,
        eventDate: new Date(contract.eventDate),
        startDate: new Date(contract.startDate),
        endDate: new Date(contract.endDate),
        totalValue: contract.totalValue,
        createdAt: new Date(contract.createdAt),
        customer: `a`,
      }))
    : [];

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-8">
        <Skeleton className="w-20 h-6 rounded-md" />
        <Skeleton className="w-full h-52 rounded-md" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-y-4 items-center space-x-6 text-xs">
        <div className="bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 rounded-md flex space-x-2 py-1 px-2">
          <span className="font-medium uppercase">Total</span>
          <span className="font-light">{contracts?.total ?? 0}</span>
        </div>
      </div>
      <DataTable columns={columns} data={formattedContracts} />
    </>
  );
}
