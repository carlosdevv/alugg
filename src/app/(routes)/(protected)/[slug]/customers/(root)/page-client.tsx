"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetCustomersService } from "@/http/customers/use-customers-service";
import { useMemo, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type CustomersPageClientProps = {
  slug: string;
};

export default function CustomersPageClient({
  slug,
}: CustomersPageClientProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [customerName, setCustomerName] = useState("");
  const [debouncedCustomerName] = useDebounce(customerName, 500);

  const { data: customers, isLoading } = useGetCustomersService(
    {
      slug,
      page,
      limit: pageSize,
      customerName: debouncedCustomerName || undefined,
    },
    {
      enabled: !!slug,
      queryKey: ["getCustomers", slug, page, pageSize, debouncedCustomerName],
      initialData: {
        data: [],
        total: 0,
        pagination: {
          total: 0,
          pages: 0,
          page: 1,
          limit: 10,
        },
      },
    }
  );

  const formattedCustomers = useMemo(
    () =>
      customers?.data.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      })) ?? [],
    [customers]
  );

  const handleCustomerNameChange = (name: string) => {
    setCustomerName(name);
    setPage(1);
  };

  const paginationData = {
    pageCount: customers?.pagination?.pages ?? 0,
    pageSize,
    page,
    onPageChange: (newPage: number) => {
      setPage(newPage);
    },
    onPageSizeChange: (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1);
    },
  };

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
          <span className="font-light">{customers?.total ?? 0}</span>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={formattedCustomers}
        pagination={paginationData}
        toolbar={{
          onCustomerNameChange: handleCustomerNameChange,
          customerName,
          isLoading,
        }}
      />
    </>
  );
}
