import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { appRoutes } from "@/lib/constants";
import { columns, type StockItems } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function InventoryPage() {
  const data: StockItems[] = [
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
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={appRoutes.inventory.root}>
              Estoque
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-semibold text-2xl mt-4">Estoque</h1>
      <Separator className="my-2" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
