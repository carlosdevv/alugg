"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onClick: () => Promise<void>;
  isPending?: boolean;
};
export default function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onClick,
  isPending,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <Icons.circleAlert className="opacity-80 size-4" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">{title}</DialogTitle>
            <DialogDescription className="sm:text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={isPending}
              type="button"
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            type="button"
            className="flex-1 bg-rose-600 text-white hover:bg-rose-500"
            onClick={onClick}
          >
            {isPending && <Icons.loader className="mr-2 size-4 animate-spin" />}
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
