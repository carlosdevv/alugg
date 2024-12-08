"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetItemsService } from "@/http/items/use-items-service";
import { useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type ItemsPageClientProps = {
  slug: string;
};

export default function ItemsPageClient({ slug }: ItemsPageClientProps) {
  const { data, isLoading } = useGetItemsService({ slug });

  const [active, setActive] = useState(0);

  const formattedData = data ? data : [];

  useEffect(() => {
    if (data) {
      const activeCounter = data.reduce((total, item) => {
        return item.status === "ACTIVE" ? total + 1 : total;
      }, 0);
      setActive(activeCounter);
    }
  }, [data]);

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
          <span className="font-light">{formattedData.length}</span>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900 dark:border dark:border-emerald-700 rounded-md flex space-x-2 py-1 px-2">
          <span className="font-medium uppercase">Itens ativos</span>
          <span className="font-light">{active}</span>
        </div>
        <div className="bg-rose-100 dark:bg-rose-900 dark:border dark:border-rose-700 rounded-md flex space-x-2 py-1 px-2">
          <span className="font-medium uppercase">Itens inativos</span>
          <span className="font-light">{formattedData.length - active} </span>
        </div>
      </div>
      <DataTable columns={columns} data={formattedData} />
    </>
  );
}
