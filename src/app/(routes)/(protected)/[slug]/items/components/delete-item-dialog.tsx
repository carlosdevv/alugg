import DeleteDialog from "@/components/ui/custom/delete-dialog";
import { useDeleteItemService } from "@/http/items/use-items-service";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type DeleteInventoryItemDialogProps = {
  itemId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteInventoryItemDialog({
  itemId,
  open,
  onOpenChange,
}: DeleteInventoryItemDialogProps) {
  const { slug } = useParams() as { slug: string };
  const {
    mutateAsync: deleteItemService,
    isPending,
    isSuccess,
  } = useDeleteItemService();

  async function onDelete() {
    toast.promise(deleteItemService({ itemId, slug }), {
      loading: "Removendo item...",
    });
  }

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess]);

  return (
    <>
      <DeleteDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Tem Certeza?"
        description="Você está prestes a remover um item. Esta ação é irreversível."
        onClick={onDelete}
        isPending={isPending}
      />
    </>
  );
}
