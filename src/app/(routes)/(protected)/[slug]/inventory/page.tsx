import { PageContent } from "@/components/page-layout";
import { PageWrapper } from "@/components/page-layout/page-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { appRoutes } from "@/lib/constants";
import { columns, type InventoryItemColumn } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function InventoryPage() {
  const data: InventoryItemColumn[] = [
    {
      id: "1",
      name: "VESTIDO TOTAL GLITTER C/ MG 1/4",
      category: "Cadeiras",
      code: "X1200",
      objectPrice: 100,
      rentPrice: 50,
      size: "GG",
      color: "Madeira",
      description: "description",
      amount: 10,
      imageUrl: "https://github.com/shadcn.png",
      itemInactive: false,
      itemInRenovation: false,
    },
  ];

  return (
    <PageContent title="Estoque">
      <PageWrapper>
        <div className="flex flex-wrap gap-y-4 items-center space-x-6 text-xs mb-4">
          <div className="bg-gray-100 rounded-md flex space-x-6 py-1 px-2">
            <span className="font-medium uppercase">Total</span>
            <span className="font-light">116</span>
          </div>
          <div className="bg-emerald-100 rounded-md flex space-x-6 py-1 px-2">
            <span className="font-medium uppercase">Itens ativos</span>
            <span className="font-light">100</span>
          </div>
          <div className="bg-rose-100 rounded-md flex space-x-6 py-1 px-2">
            <span className="font-medium uppercase">Itens inativos</span>
            <span className="font-light">16</span>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </PageWrapper>
    </PageContent>
  );
}
