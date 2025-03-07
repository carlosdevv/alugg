import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateContractContext } from "@/contexts/create-contract-context";
import { useGetItemsService } from "@/http/items/use-items-service";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export function StepTwo() {
  const { slug } = useParams() as { slug: string };
  const { form, selectedItems, setSelectedItems } = useCreateContractContext();
  const { data: items, isLoading } = useGetItemsService({ slug });

  const formattedData = items
    ? items.map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        status: item.status,
        imageUrl: item.imageUrl,
        code: item.code,
        price: item.rentPrice,
      }))
    : [];

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = items?.find((i) => i.id === itemId);

    if (!item || quantity < 1) {
      toast.error("Não é possível adicionar menos que 1 item.");
      return;
    }

    if (quantity > item.amount) {
      toast.error(
        "Não é possível adicionar mais itens que o estoque disponível."
      );
      return;
    }

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
        {selectedItems.size > 0 && <Label>Itens Selecionados:</Label>}
        <div className="h-full max-h-48 overflow-y-auto space-y-2">
          {Array.from(selectedItems).map(([itemId, quantity]) => {
            const item = items?.find((i) => i.id === itemId);
            if (!item) return null;

            return (
              <div
                key={itemId}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    R$ {item.rentPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="flex items-center gap-x-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="size-8"
                      onClick={() => handleQuantityChange(itemId, quantity - 1)}
                    >
                      <Icons.circleMinus className="size-4" />
                    </Button>
                    <Input
                      max={item.amount}
                      value={quantity}
                      onChange={(e) => {
                        const formattedValue = e.target.value.replace(
                          /\D/g,
                          ""
                        );
                        if (formattedValue === "") {
                          handleQuantityChange(itemId, 0);
                          return;
                        }

                        handleQuantityChange(itemId, parseInt(formattedValue));
                      }}
                      className="w-14"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="size-8"
                      onClick={() => handleQuantityChange(itemId, quantity + 1)}
                    >
                      <Icons.circlePlus className="size-4" />
                    </Button>
                  </div>
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
      {isLoading ? (
        <div className="flex flex-col gap-y-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Skeleton className="w-24 h-8 rounded" />
              <Skeleton className="w-24 h-8 rounded" />
            </div>
            <Skeleton className="w-24 h-8 rounded" />
          </div>
          <Skeleton className="h-40 w-full rounded" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={formattedData}
          selectedItems={selectedItems}
          onSelectedItemsChange={setSelectedItems}
        />
      )}
    </div>
  );
}
