import DeleteDialog from "@/components/ui/custom/delete-dialog";
import { useDeleteCustomerService } from "@/http/customers/use-customers-service";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type DeleteCustomerDialogProps = {
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCustomerDialog({
  customerId,
  onOpenChange,
  open,
}: DeleteCustomerDialogProps) {
  const { slug } = useParams() as { slug: string };
  const {
    mutateAsync: deleteCustomerService,
    isPending,
    isSuccess,
  } = useDeleteCustomerService({
    slug,
  });

  async function onDelete() {
    toast.promise(deleteCustomerService({ customerId }), {
      loading: "Removendo cliente...",
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
        description="Você está prestes a remover um cliente. Esta ação é irreversível."
        onClick={onDelete}
        isPending={isPending}
      />
    </>
  );
}
