import { useGetItemsAvailabilityService } from "@/http/items/use-items-service";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type UseAddItemsDialogProps = {
  eventDate: string;
  withdrawalDate: string;
  returnDate: string;
  onItemsSelected: (items: Map<string, number>) => void;
  existingItemIds?: string[];
};

export function useAddItemsDialog({
  eventDate,
  withdrawalDate,
  returnDate,
  onItemsSelected,
  existingItemIds = [],
}: UseAddItemsDialogProps) {
  const { slug } = useParams() as { slug: string };
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(
    new Map()
  );

  const ensureDateFormat = (dateString: string): string => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }

    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, "dd/MM/yyyy");
      }
    } catch (error) {
      console.error("Erro ao formatar data:", error);
    }

    return format(new Date(), "dd/MM/yyyy");
  };

  const { data: availabilityData, isLoading } = useGetItemsAvailabilityService(
    {
      slug,
      eventDate: ensureDateFormat(eventDate),
      withdrawalDate: ensureDateFormat(withdrawalDate),
      returnDate: ensureDateFormat(returnDate),
    },
    {
      queryKey: [
        "getItemsAvailability",
        slug,
        eventDate,
        withdrawalDate,
        returnDate,
      ],
      enabled: open,
    }
  );

  const items = availabilityData?.data || [];
  
  const formattedData =
    items.length > 0
      ? items
          .filter((item) => item.availableQuantity > 0)
          .map((item) => ({
            id: item.id,
            name: item.name,
            amount: item.amount,
            availableQuantity: item.availableQuantity,
            status: item.status,
            imageUrl: item.imageUrl,
            code: item.code,
            price: item.rentPrice,
            isAvailable: item.isAvailable,
            reservations: item.reservations,
          }))
      : [];

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = items?.find((i) => i.id === itemId);

    if (!item || quantity < 1) {
      toast.error("Não é possível adicionar menos que 1 item.");
      return;
    }

    if (quantity > item.availableQuantity) {
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

  const handleAddItems = () => {
    if (selectedItems.size === 0) {
      toast.error("Selecione pelo menos um item para adicionar.");
      return;
    }

    onItemsSelected(selectedItems);
    setOpen(false);
    setSelectedItems(new Map());
  };

  return {
    open,
    setOpen,
    selectedItems,
    setSelectedItems,
    handleQuantityChange,
    handleRemoveItem,
    handleAddItems,
    items,
    isLoading,
    formattedData,
  };
}
