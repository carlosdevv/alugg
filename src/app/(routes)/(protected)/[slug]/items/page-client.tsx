"use client";

import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { useEffect, useState } from "react";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { useGetItemsService } from "../../../../../http/items/use-items-service";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

type ItemsPageClientProps = {
  slug: string;
};

export default function ItemsPageCLlent({ slug }: ItemsPageClientProps) {
  const { data, isLoading } = useGetItemsService({ slug });

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (data) {
      const activeCounter = data.reduce((total, item) => {
        return item.status === "ACTIVE" ? total + 1 : total;
      }, 0);
      setActive(activeCounter);
    }
  }, [data]);

  if (isLoading) return <Skeleton />;
  return (
    <PageContent title="Estoque">
      <PageWrapper>
        {isLoading ? (
          <Skeleton className="w-20 h-6 rounded-md" />
        ) : !data ? (
          <div className="text-center text-sm font-medium">
            Nenhum item encontrado.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-y-4 items-center space-x-6 text-xs mb-4">
              <div className="bg-gray-100 rounded-md flex space-x-6 py-1 px-2">
                <span className="font-medium uppercase">Total</span>
                <span className="font-light">{data.length}</span>
              </div>
              <div className="bg-emerald-100 rounded-md flex space-x-6 py-1 px-2">
                <span className="font-medium uppercase">Itens ativos</span>
                <span className="font-light">{active}</span>
              </div>
              <div className="bg-rose-100 rounded-md flex space-x-6 py-1 px-2">
                <span className="font-medium uppercase">Itens inativos</span>
                <span className="font-light">{data.length - active} </span>
              </div>
            </div>
            <DataTable columns={columns} data={data} />
          </>
        )}
      </PageWrapper>
    </PageContent>
  );
}
