"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePendingInvites } from "./use-pending-invites";

dayjs.extend(relativeTime);

export function PendingInvites() {
  const {
    isOpen,
    setIsOpen,
    invites,
    isGettingInvites,
    acceptInvite,
    rejectInvite,
  } = usePendingInvites();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-neutral-200/50"
              >
                <Icons.bell className="size-4" />
                <span className="sr-only">Convites pendentes</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver convites pendentes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>

      <PopoverContent className="space-y-2 w-60">
        {isGettingInvites && <Icons.loader className="animate-spin size-4" />}
        <span className="block text-sm font-medium">
          Convites Pendentes ({invites?.length ?? 0})
        </span>

        {invites?.length === 0 && (
          <p className="text-sm text-muted-foreground">Sem convites.</p>
        )}

        {invites?.map((invite) => {
          return (
            <div key={invite.id} className="space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {invite.author?.name ?? "Usuário"}
                </span>{" "}
                convidou você para participar da organização{" "}
                <span className="font-medium text-foreground">
                  {invite.organization.name}
                </span>{" "}
                <span>{dayjs(invite.createdAt).fromNow()}</span>
              </p>

              <div className="flex gap-1">
                <Button
                  onClick={() => acceptInvite(invite.id)}
                  size="sm"
                  variant="outline"
                >
                  <Icons.check className="mr-1.5 size-3" />
                  Aceitar
                </Button>

                <Button
                  onClick={() => rejectInvite(invite.id)}
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  <Icons.x className="mr-1.5 size-3" />
                  Rejeitar
                </Button>
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
