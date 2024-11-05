"use client";

import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import { columns} from "./components/columns";
import { DataTable } from "./components/data-table";
import { useGetCategoriesService } from "@/http/category/use-categories-service";

export default function InventoryPage() {

  const { data: categories } = useGetCategoriesService();

  const data = categories?.map((category) => ({
    id: category.id.toString(),
    name: category.name,
    totalItems: category.totalItems,
    itemInactive: false,
  })) ?? [
    {
      id: "1",
      name: "MENSAGEM MOCKADA",
      totalItems: 2,
      itemInactive: false,
    },
  ];

  return (
    <PageContent title="Categorias">
      <PageWrapper>
        <div className="flex flex-wrap gap-y-4 items-center space-x-6 text-xs mb-4">
          <div className="bg-gray-100 rounded-md flex space-x-6 py-1 px-2">
            <span className="font-medium uppercase">Total</span>
            <span className="font-light"> {categories == null ? 0 : categories.length} </span>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </PageWrapper>
    </PageContent>
  );
}
