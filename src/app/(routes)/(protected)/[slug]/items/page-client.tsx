"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetItemsService } from "@/http/items/use-items-service";
import { useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type ItemsPageClientProps = {
  slug: string;
};

export default function ItemsPageClient({ slug }: ItemsPageClientProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [debouncedItemName] = useDebounce(itemName, 500);

  const { data, isLoading } = useGetItemsService(
    {
      slug,
      page,
      limit: pageSize,
      itemName: debouncedItemName || undefined,
      status: status.length > 0 ? status : undefined,
    },
    {
      enabled: !!slug,
      queryKey: ["getItems", slug, page, pageSize, debouncedItemName, status],
      initialData: {
        items: [],
        total: 0,
        counts: {
          active: 0,
          inactive: 0,
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

  const formattedData = data?.items ?? [];

  const handleItemNameChange = (name: string) => {
    setItemName(name);
    setPage(1);
  };

  const handleStatusChange = (newStatus: string[]) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatus([]);
    setItemName("");
    setPage(1);
  };

  const paginationData = {
    pageCount: data?.pagination?.pages ?? 0,
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
        <div className="flex items-center space-x-6 text-xs">
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
      <div className="flex flex-wrap gap-y-4 items-center space-x-6 text-xs mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 rounded-md flex space-x-2 py-1 px-2">
          <span className="font-medium uppercase">Total</span>
          <span className="font-light">{data?.total ?? 0}</span>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900 dark:border dark:border-emerald-700 rounded-md flex space-x-2 py-1 px-2">
          <span className="font-medium uppercase">Itens ativos</span>
          <span className="font-light">{data?.counts.active ?? 0}</span>
        </div>
        <div className="bg-rose-100 dark:bg-rose-900 dark:border dark:border-rose-700 rounded-md flex space-x-2 py-1 px-2">
          <span className="font-medium uppercase">Itens inativos</span>
          <span className="font-light">{data?.counts.inactive ?? 0}</span>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={formattedData}
        pagination={paginationData}
        toolbar={{
          onItemNameChange: handleItemNameChange,
          itemName,
          isLoading,
          onStatusChange: handleStatusChange,
          onResetFilters: handleResetFilters,
          status,
        }}
      />
    </>
  );
}
