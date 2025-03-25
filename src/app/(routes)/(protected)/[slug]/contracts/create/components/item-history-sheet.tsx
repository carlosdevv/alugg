"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetItemHistoryService } from "@/http/items/use-items-service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useState } from "react";

interface ItemHistorySheetProps {
  itemId: string;
  itemName: string;
}

export function ItemHistorySheet({ itemId, itemName }: ItemHistorySheetProps) {
  const { slug } = useParams() as { slug: string };

  const [open, setOpen] = useState(false);

  const { data: historyData, isLoading } = useGetItemHistoryService(
    {
      slug,
      itemId,
    },
    {
      enabled: open,
      queryKey: ["getItemHistory", itemId],
    }
  );

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Icons.history className="mr-2 h-4 w-4" />
          Visualizar histórico
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Histórico de Contratos</SheetTitle>
          <SheetDescription>
            Histórico de contratos para o item: {itemName}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <HistorySkeleton />
          ) : historyData?.data.contractHistory.length ? (
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-4">
                {historyData.data.contractHistory.map((contract, index) => (
                  <div
                    key={`${contract.contractId}-${index}`}
                    className="border rounded-md p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">
                          Contrato #{contract.code}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Cliente: {contract.customerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(contract.totalValue)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {contract.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Evento</p>
                        <p>{formatDate(contract.eventDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Retirada</p>
                        <p>{formatDate(contract.withdrawalDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Devolução</p>
                        <p>{formatDate(contract.returnDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <Icons.circleAlert className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">
                Nenhum histórico encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                Este item ainda não foi incluído em nenhum contrato.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border rounded-md p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
