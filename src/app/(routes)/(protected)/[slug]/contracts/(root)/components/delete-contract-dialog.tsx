import DeleteDialog from "@/components/ui/custom/delete-dialog";
import { useDeleteContractService } from "@/http/contracts/use-contracts-service";
import { createClient } from "@/lib/supabase/client";
import { ContractDocumentType } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type DeleteContractDialogProps = {
  contractId: string;
  contractCode: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteContractDialog({
  contractId,
  contractCode,
  onOpenChange,
  open,
}: DeleteContractDialogProps) {
  const { slug } = useParams() as { slug: string };
  const {
    mutateAsync: deleteContractService,
    isPending,
    isSuccess,
  } = useDeleteContractService();

  async function onDelete() {
    const supabase = createClient();

    toast.promise(
      async () => {
        try {
          await deleteContractService(contractId);

          const { error: storageErrorInvoice } = await supabase.storage
            .from("organization-contracts")
            .remove([
              `${slug}/${ContractDocumentType.INVOICE.toLowerCase()}/contrato-${contractCode}-locacao.pdf`,
            ]);

          const { error: storageErrorWithdrawal } = await supabase.storage
            .from("organization-contracts")
            .remove([
              `${slug}/${ContractDocumentType.WITHDRAWAL.toLowerCase()}/contrato-${contractCode}-retirada.pdf`,
            ]);

          const { error: storageErrorReturn } = await supabase.storage
            .from("organization-contracts")
            .remove([
              `${slug}/${ContractDocumentType.RETURN.toLowerCase()}/contrato-${contractCode}-devolução.pdf`,
            ]);

          if (
            storageErrorInvoice ||
            storageErrorWithdrawal ||
            storageErrorReturn
          ) {
            console.error(
              "Erro ao remover arquivo:",
              storageErrorInvoice ||
                storageErrorWithdrawal ||
                storageErrorReturn
            );
          }

          return true;
        } catch (error) {
          console.error("Erro ao excluir contrato:", error);
          throw error;
        }
      },
      {
        loading: "Removendo contrato...",
      }
    );
  }

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tem Certeza?"
      description="Você está prestes a remover um contrato e seus arquivos associados. Esta ação é irreversível."
      onClick={onDelete}
      isPending={isPending}
    />
  );
}
