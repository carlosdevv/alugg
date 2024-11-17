import { useRevokeInviteService } from "@/http/invites/use-invites-service";
import { toast } from "sonner";

type UseInviteCardProps = {
  slug: string;
  inviteId: string;
};

export default function useInviteCard({ slug, inviteId }: UseInviteCardProps) {
  const { mutateAsync: revokeInviteService, isPending: isRevokingInvite } =
    useRevokeInviteService();

  function normalizeRole(role: string) {
    const roles = {
      ADMIN: "Administrador",
      MEMBER: "Membro",
    };

    return roles[role as keyof typeof roles];
  }

  async function revokeInvite() {
    toast.promise(
      revokeInviteService({
        slug,
        inviteId,
      }),
      {
        loading: "Revogando convite...",
      }
    );
  }

  return { normalizeRole, revokeInvite, isRevokingInvite };
}
