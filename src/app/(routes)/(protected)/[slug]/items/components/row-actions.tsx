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
import sessionStore from "../../../../../../hooks/session-context";
import { useDeleteItemService } from "../../../../../../http/items/use-items-service";
import { appRoutes } from "../../../../../../lib/constants";
import type { Item } from "./columns";
import { DeleteInventoryItemDialog } from "./delete-dialog";

type RowActionsProps<TData> = {
  row: Row<TData>;
};

export function RowActions<TData>({ row }: RowActionsProps<TData>) {
  const props = row.original as Item;
  const { slug } = sessionStore();

  const deleteItemMutation = useDeleteItemService();

  function handleDelete() {
    deleteItemMutation.mutate({
      itemId: props.id,
      slug,
    });
  }

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
                <Link
                  href={{
                    pathname: `${appRoutes.items.root}/${props.id}`,
                  }}
                >
                  Ver Detalhes
                  <DropdownMenuShortcut>
                    <Icons.moveUpRight className="size-4 mr-2" />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <Button
                    onClick={handleDelete}
                    variant={"ghost"}
                    className="w-full justify-between flex"
                  >
                    Remover
                    <DropdownMenuShortcut>
                      <Icons.delete className="size-4 mr-2" />
                    </DropdownMenuShortcut>
                  </Button>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DeleteInventoryItemDialog />
    </AlertDialog>
  );
}
