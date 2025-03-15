import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appRoutes } from "@/lib/constants";
import type { Row } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import type { ContractColumn } from "./columns";
import { DeleteContractDialog } from "./delete-contract-dialog";
import { toast } from "sonner";

type RowActionsProps<TData> = {
  row: Row<TData>;
};

export function RowActions<TData>({ row }: RowActionsProps<TData>) {
  const props = row.original as ContractColumn;
  const contractId = props.id;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleViewPdf = () => {
    if (props.contractUrl) {
      window.open(props.contractUrl, "_blank");
    } else {
      toast.error(
        "Ocorreu um erro ao carregar o PDF, tente novamente mais tarde."
      );
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
          <DropdownMenuContent className="w-44 mr-4">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link
                  href={{
                    pathname: `${appRoutes.contracts.root}/${props.id}`,
                  }}
                  className="flex items-center justify-between"
                >
                  Ver Detalhes
                  <Icons.horizontalEllipsis className="size-4" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center justify-between"
                onClick={handleViewPdf}
              >
                Visualizar PDF
                <Icons.file className="size-4" />
              </DropdownMenuItem>

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
      <DeleteContractDialog
        contractId={contractId}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
