import { columns, type StockItems } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function Inventory() {
  const data: StockItems[] = [
    {
      id: "1",
      name: "name",
      category: "category",
      code: "code",
      objectPrice: 1,
      rentPrice: 1,
      size: "size",
      color: "color",
      description: "description",
      amount: 1,
      imageUrl: "https://github.com/shadcn.png",
    },
  ];
  return (
    <div className="">
      <h1 className="font-semibold text-2xl">Estoque</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
