"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetCustomersService } from "@/http/customers/use-customers-service";
import { useMemo } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type CustomersPageClientProps = {
  slug: string;
};

export default function CustomersPageClient({
  slug,
}: CustomersPageClientProps) {
  const { data: customer, isLoading } = useGetCustomersService({ slug });

  const formattedCustomer = useMemo(
    () =>
      customer?.data
        ? customer.data.map((customer) => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          }))
        : [],
    [customer]
  );

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
          <span className="font-light">{customer?.total ?? 0}</span>
        </div>
      </div>
      <DataTable columns={columns} data={formattedCustomer} />
    </>
  );
}
