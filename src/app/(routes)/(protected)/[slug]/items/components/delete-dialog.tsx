import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteItemService } from "@/http/items/use-items-service";

type DeleteInventoryItemDialogProps = {
  itemId: string;
  slug: string;
};

export function DeleteInventoryItemDialog({
  itemId,
  slug,
}: DeleteInventoryItemDialogProps) {
  const { mutateAsync: deleteItemService } = useDeleteItemService();

  async function handleDeleteItem() {
    await deleteItemService({
      itemId,
      slug,
    });
  }

  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem Certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a remover um item. Esta ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteItem}
            className="bg-rose-500 hover:bg-rose-600 transition-all text-primary"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
}
