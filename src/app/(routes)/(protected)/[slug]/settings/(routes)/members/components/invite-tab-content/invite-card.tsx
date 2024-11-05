import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { GetInvitesServiceResponse } from "@/http/invites/types";
import { getInitials } from "@/lib/utils";
import useInviteCard from "./use-invite-card";

type InviteCardProps = {
  slug: string;
  invite: GetInvitesServiceResponse;
};

export default function InviteCard({ slug, invite }: InviteCardProps) {
  const { id, author, email, role: currentRole } = invite;

  const {} = useInviteCard({});

  return (
    <>
      <div
        key={id}
        className="flex items-center justify-between space-x-3 px-4 py-6 sm:pl-8"
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar className="size-7">
              <AvatarFallback className="bg-black/15">
                <span className="text-xs">{getInitials(name ?? "AA")}</span>
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{author?.name || email}</h3>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Button
            type="button"
            className="h-8 space-x-0 px-1 py-2"
            variant="outline"
          >
            Recusar Convite
          </Button>
          <Button
            type="button"
            className="h-8 space-x-0 px-1 py-2"
            variant="outline"
          >
            Aceitar Convite
          </Button>
        </div>
      </div>
    </>
  );
}
