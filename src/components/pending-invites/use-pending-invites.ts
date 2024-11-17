import {
  useAcceptInviteService,
  usePendingInvitesService,
  useRejectInviteService,
} from "@/http/invites/use-invites-service";
import { useParams } from "next/navigation";
import { useState } from "react";

export function usePendingInvites() {
  const { slug } = useParams() as { slug: string };
  const [isOpen, setIsOpen] = useState(false);

  const { data: invites, isPending: isGettingInvites } =
    usePendingInvitesService(
      { slug },
      {
        enabled: isOpen && !!slug,
        queryKey: ["pendingInvites", slug],
      }
    );
  const { mutateAsync: acceptInviteService } = useAcceptInviteService();
  const { mutateAsync: rejectInviteService } = useRejectInviteService();

  async function acceptInvite(inviteId: string) {
    await acceptInviteService({ slug, inviteId });
  }

  async function rejectInvite(inviteId: string) {
    await rejectInviteService({ slug, inviteId });
  }

  return {
    isOpen,
    setIsOpen,
    invites,
    isGettingInvites,
    acceptInvite,
    rejectInvite,
  };
}
