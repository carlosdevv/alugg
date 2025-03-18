"use client";
import { columns } from "@/app/(routes)/(protected)/[slug]/contracts/create/components/columns";
import { DataTable } from "@/app/(routes)/(protected)/[slug]/contracts/create/components/data-table";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddItemsDialog } from "./use-add-items-dialog";

export type AddItemsDialogProps = {
  eventDate: string;
  withdrawalDate: string;
  returnDate: string;
  onItemsSelected: (items: Map<string, number>) => void;
  existingItemIds?: string[];
};

export function AddItemsDialog({
  eventDate,
  withdrawalDate,
  returnDate,
  onItemsSelected,
  existingItemIds,
}: AddItemsDialogProps) {
  const {
    open,
    setOpen,
    selectedItems,
    setSelectedItems,
    handleQuantityChange,
    handleRemoveItem,
    handleAddItems,
    isLoading,
    formattedData,
  } = useAddItemsDialog({
    eventDate,
    withdrawalDate,
    returnDate,
    onItemsSelected,
    existingItemIds,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Icons.circlePlus className="mr-2 h-4 w-4" />
          Adicionar Itens
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Itens ao Contrato</DialogTitle>
          <DialogDescription>
            Selecione os itens que deseja adicionar ao contrato.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-4 mt-4">
          <div className="flex flex-col space-y-2">
            {selectedItems.size > 0 && (
              <div className="font-medium">Itens Selecionados:</div>
            )}
            <div className="h-full max-h-48 overflow-y-auto space-y-2">
              {Array.from(selectedItems).map(([itemId, quantity]) => {
                const item = formattedData?.find((i) => i.id === itemId);
                if (!item) return null;

                return (
                  <div
                    key={itemId}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        R$ {item.price.toFixed(2)}
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
                          max={item.availableQuantity}
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
                      <Badge variant="secondary">
                        Disponível: {item.availableQuantity}
                      </Badge>
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

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddItems}>
              Adicionar {selectedItems.size} {selectedItems.size === 1 ? 'Item' : 'Itens'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
