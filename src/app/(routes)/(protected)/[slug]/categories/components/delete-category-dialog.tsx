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
import { useDeleteCategoryService } from "@/http/category/use-categories-service";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type DeleteCategoryDialogProps = {
  categoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCategoryDialog({
  categoryId,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const { slug } = useParams() as { slug: string };
  const { mutateAsync: deleteCategoryService } = useDeleteCategoryService();

  async function onDelete() {
    toast.promise(deleteCategoryService({ slug, categoryId }), {
      loading: "Removendo categoria...",
    });
  }

  return (
    <>
      <DeleteDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Tem Certeza?"
        description="Você está prestes a remover uma categoria. Esta ação é irreversível."
        onClick={onDelete}
      />
    </>
  );
}
