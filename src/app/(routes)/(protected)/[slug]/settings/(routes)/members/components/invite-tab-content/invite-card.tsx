import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { GetInvitesServiceResponse } from "@/http/invites/types";
import useInviteCard from "./use-invite-card";

type InviteCardProps = {
  slug: string;
  invite: GetInvitesServiceResponse;
};

export default function InviteCard({ slug, invite }: InviteCardProps) {
  const { id, author, email, role } = invite;

  const { normalizeRole, revokeInvite, isRevokingInvite } = useInviteCard({
    slug,
    inviteId: id,
  });

  return (
    <>
      <div
        key={id}
        className="flex items-center justify-between space-x-3 px-4 py-6 sm:pl-8"
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar className="size-7">
              <AvatarFallback className="bg-black/15" />
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{email}</h3>
              <p className="text-xs text-gray-500">
                Enviado por - <b>{author?.name}</b>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Button type="button" variant="outline" className="cursor-default">
            {normalizeRole(role)}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={async () => await revokeInvite()}
            disabled={isRevokingInvite}
          >
            {isRevokingInvite ? (
              <Icons.loader className="animate-spin size-4 mr-2" />
            ) : (
              <Icons.circleMinus className="size-4 mr-2" />
            )}
            Revogar Convite
          </Button>
        </div>
      </div>
    </>
  );
}
