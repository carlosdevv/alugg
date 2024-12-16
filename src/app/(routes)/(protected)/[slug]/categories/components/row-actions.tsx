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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Row } from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import type { CategoryColumn } from "./columns";
import { DeleteCategoryDialog } from "./delete-dialog";

type RowActionsProps<TData> = {
  row: Row<TData>;
};

export function RowActions<TData>({ row }: RowActionsProps<TData>) {
  const props = row.original as CategoryColumn;
  const categoryId = props.id;
  const [, setModal] = useQueryState("modal");
  const [, setCategoryId] = useQueryState("id");

  return (
    <AlertDialog>
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Ações da linha">
              <Icons.verticalEllipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-44">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex justify-between cursor-pointer"
                onClick={() => {
                  setModal("update-category");
                  setCategoryId(categoryId);
                }}
              >
                Editar
                <Icons.update className="size-4" />
              </DropdownMenuItem>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer flex justify-between text-rose-500">
                  Remover
                  <Icons.delete className="size-4" />
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DeleteCategoryDialog categoryId={categoryId} />
    </AlertDialog>
  );
}
