import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateContractContext } from "@/contexts/create-contract-context";
import { useGetItemsService } from "@/http/items/use-items-service";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";

export function StepTwo() {
  const { slug } = useParams() as { slug: string };
  const { form, selectedItems, setSelectedItems } = useCreateContractContext();
  const { data: items } = useGetItemsService({ slug });

  const formattedData = items
    ? items.map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        status: item.status,
        imageUrl: item.imageUrl,
        code: item.code,
      }))
    : [];

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = items?.find((i) => i.id === itemId);
    if (!item || quantity > item.amount || quantity < 1) return;

    const newSelectedItems = new Map(selectedItems);
    newSelectedItems.set(itemId, quantity);
    setSelectedItems(newSelectedItems);
  };

  const handleRemoveItem = (itemId: string) => {
    const newSelectedItems = new Map(selectedItems);
    newSelectedItems.delete(itemId);
    setSelectedItems(newSelectedItems);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Itens Selecionados</Label>
        <div className="h-full max-h-48 overflow-y-auto space-y-2">
          {Array.from(selectedItems).map(([itemId, quantity]) => {
            const item = items?.find((i) => i.id === itemId);
            if (!item) return null;

            return (
              <div
                key={itemId}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-x-2">
                  <Input
                    type="number"
                    min={1}
                    max={item.amount}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(itemId, parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                  <Badge variant="secondary">Disponível: {item.amount}</Badge>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleRemoveItem(itemId)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Icons.delete className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={formattedData}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
      />
    </div>
  );
}
