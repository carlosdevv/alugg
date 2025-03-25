import { Icons } from "@/components/icons";
import { ReturnContractModal } from "@/components/modals/return-contract-modal";
import { WithdrawalContractModal } from "@/components/modals/withdrawal-contract-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appRoutes } from "@/lib/constants";
import { ContractDocumentType, ContractStatus } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import type { ContractColumn } from "./columns";
import { DeleteContractDialog } from "./delete-contract-dialog";

type RowActionsProps<TData> = {
  row: Row<TData>;
};

export function RowActions<TData>({ row }: RowActionsProps<TData>) {
  const props = row.original as ContractColumn;
  const contractId = props.id;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [, setOpenModal] = useQueryState("modal", parseAsString);

  const handleViewPdf = (contractType: ContractDocumentType) => {
    const pdfUrl = props.contractDocuments.find(
      (document) => document.type === contractType
    )?.url;

    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      toast.error("Ainda não há PDF disponível para esta opção.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icons.verticalEllipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 mr-4">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={props.status !== ContractStatus.OPEN}
                asChild
              >
                <Link
                  href={{
                    pathname: `${appRoutes.contracts.root}/${props.id}`,
                  }}
                  className="flex items-center justify-between"
                >
                  Atualizar Contrato
                  <Icons.update className="size-4" />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Ações</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setOpenModal("withdrawal-modal")}
                      disabled={props.status !== ContractStatus.OPEN}
                    >
                      Retirada
                      <Icons.fileUp className="size-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setOpenModal("return-modal")}
                      disabled={props.status !== ContractStatus.COLLECTED}
                    >
                      Devolução
                      <Icons.fileDown className="size-4" />
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Visualizar PDF</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        handleViewPdf(ContractDocumentType.INVOICE)
                      }
                    >
                      Venda
                      <Icons.file className="size-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        handleViewPdf(ContractDocumentType.WITHDRAWAL)
                      }
                      disabled={props.status === ContractStatus.OPEN}
                    >
                      Retirada
                      <Icons.file className="size-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => handleViewPdf(ContractDocumentType.RETURN)}
                      disabled={props.status !== ContractStatus.CLOSED}
                    >
                      Devolução
                      <Icons.file className="size-4" />
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem
                className="flex items-center justify-between cursor-pointer text-rose-500 hover:!text-rose-500"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Remover
                <Icons.delete className="size-4" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <WithdrawalContractModal contractId={contractId} />

      <ReturnContractModal contractId={contractId} />

      <DeleteContractDialog
        contractId={contractId}
        contractCode={props.code}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
