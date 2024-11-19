import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCategoryService } from "@/http/category/use-categories-service";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type DeleteCategoryDialogProps = {
  categoryId: string;
};

export function DeleteCategoryDialog({
  categoryId,
}: DeleteCategoryDialogProps) {
  const { slug } = useParams() as { slug: string };
  const { mutateAsync: deleteCategoryService } = useDeleteCategoryService();

  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem Certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a remover uma categoria. Esta ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              toast.promise(deleteCategoryService({ slug, categoryId }), {
                loading: "Removendo categoria...",
              });
            }}
            className="bg-rose-500 hover:bg-rose-600 transition-all"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
}
