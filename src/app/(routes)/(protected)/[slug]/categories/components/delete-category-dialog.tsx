import DeleteDialog from "@/components/ui/custom/delete-dialog";
import { useDeleteCategoryService } from "@/http/category/use-categories-service";
import { useParams } from "next/navigation";
import { useEffect } from "react";
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
  const {
    mutateAsync: deleteCategoryService,
    isPending,
    isSuccess,
  } = useDeleteCategoryService();

  async function onDelete() {
    toast.promise(deleteCategoryService({ slug, categoryId }), {
      loading: "Removendo categoria...",
    });
  }

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <>
      <DeleteDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Tem Certeza?"
        description="Você está prestes a remover uma categoria. Esta ação é irreversível."
        onClick={onDelete}
        isPending={isPending}
      />
    </>
  );
}
