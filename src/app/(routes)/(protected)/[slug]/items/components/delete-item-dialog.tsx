import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DeleteDialog from "@/components/ui/custom/delete-dialog";
import { useDeleteItemService } from "@/http/items/use-items-service";
import { useParams } from "next/navigation";
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
  const { mutateAsync: deleteItemService } = useDeleteItemService();

  async function onDelete() {
    toast.promise(deleteItemService({ itemId, slug }), {
      loading: "Removendo item...",
    });
  }

  return (
    <>
      <DeleteDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Tem Certeza?"
        description="Você está prestes a remover um item. Esta ação é irreversível."
        onClick={onDelete}
      />
    </>
  );
}
