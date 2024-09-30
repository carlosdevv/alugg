import { Icons } from "@/components/icons";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Row } from "@tanstack/react-table";
import Link from "next/link";
import slugify from "slugify";
import type { InventoryItemColumn } from "./columns";
import { DeleteDialog } from "./delete-dialog";

type RowActionsProps<TData> = {
  row: Row<TData>;
};

export function RowActions<TData>({ row }: RowActionsProps<TData>) {
  const props = row.original as InventoryItemColumn;
  const slugName = slugify(props.name, { lower: true, strict: true });
  const slug = `${props.id}-${slugName}`;

  return (
    <AlertDialog>
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
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href={`/inventory/${slug}`}>
                  Ver Detalhes
                  <DropdownMenuShortcut>
                    <Icons.moveUpRight className="size-4 mr-2" />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer">
                  Remover
                  <DropdownMenuShortcut>
                    <Icons.delete className="size-4 mr-2" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DeleteDialog />
    </AlertDialog>
  );
}
