import DeleteDialog from "@/components/ui/custom/delete-dialog";
import { useDeleteContractService } from "@/http/contracts/use-contracts-service";
import { useEffect } from "react";
import { toast } from "sonner";

type DeleteContractDialogProps = {
  contractId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteContractDialog({
  contractId,
  onOpenChange,
  open,
}: DeleteContractDialogProps) {
  const {
    mutateAsync: deleteContractService,
    isPending,
    isSuccess,
  } = useDeleteContractService();

  async function onDelete() {
    toast.promise(deleteContractService(contractId), {
      loading: "Removendo contrato...",
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
        description="Você está prestes a remover um contrato. Esta ação é irreversível."
        onClick={onDelete}
        isPending={isPending}
      />
    </>
  );
}
