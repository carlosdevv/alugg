import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreateContractContext } from "@/contexts/create-contract-context";
import { useGetItemsService } from "@/http/items/use-items-service";
import { format } from "date-fns";
import { useParams, useRouter, usePathname } from "next/navigation";

export function StepThree() {
  const { slug } = useParams() as { slug: string };
  const { form, selectedItems, setSelectedItems, setCurrentStep } =
    useCreateContractContext();
  const { data: items } = useGetItemsService({ slug });

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
    <div className="grid grid-cols-[1fr_0.45fr]">
      <div className="flex flex-col gap-y-4">
        <Card>
          <CardContent className="flex items-center justify-between w-full py-4 px-20">
            <div className="flex flex-col items-center text-xs gap-y-0.5">
              <Icons.calendar className="size-5 mb-1" />
              <span className="font-medium">Evento</span>
              <span className="text-muted-foreground font-medium">
                {format(form.watch("eventDate"), "dd MMM")}
              </span>
            </div>
            <div className="flex flex-col items-center text-xs gap-y-0.5">
              <Icons.calendar className="size-5 mb-1" />
              <span className="font-medium">Retirada</span>
              <span className="text-muted-foreground font-medium">
                {format(form.watch("withdrawalDate"), "dd MMM")}
              </span>
            </div>
            <div className="flex flex-col items-center text-xs gap-y-0.5">
              <Icons.calendar className="size-5 mb-1" />
              <span className="font-medium">Devolução</span>
              <span className="text-muted-foreground font-medium">
                {format(form.watch("returnDate"), "dd MMM")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Produtos Contratados</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentStep(2)}
              >
                Adicionar Produto
              </Button>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col space-y-2">
            <header className="flex items-center justify-between">
              <span>Imagem</span>
              <span>Nome</span>
              <span>Código</span>
              <span>Quantidade</span>
              <span>Bônus</span>
              <div className="flex items-center gap-x-2">
                <span>Desconto</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.help className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Desconto é opcional, caso não seja informado, o desconto
                      será de 0%
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span>Valor por Item</span>
            </header>

            {/* body */}
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
                      <Badge variant="secondary">
                        Disponível: {item.amount}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
