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
import type { CustomerColumn } from "./columns";
import { DeleteCustomerDialog } from "./delete-customer-dialog";

type RowActionsProps<TData> = {
  row: Row<TData>;
};

export function RowActions<TData>({ row }: RowActionsProps<TData>) {
  const props = row.original as CustomerColumn;
  const customerId = props.id;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icons.verticalEllipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link
                  href={{
                    pathname: `${appRoutes.customers.root}/${props.id}`,
                  }}
                  className="flex items-center justify-between"
                >
                  Ver Detalhes
                  <Icons.horizontalEllipsis className="size-4" />
                </Link>
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
      <DeleteCustomerDialog
        customerId={customerId}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
