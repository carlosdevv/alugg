import {
  useDeleteMemberService,
  useTransferOwnershipService,
  useUpdateMemberRoleService,
} from "@/http/members/use-members-service";
import type { Role } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

type UseMemberCardProps = {
  slug: string;
  memberId: string;
};

export default function useMemberCard({ slug, memberId }: UseMemberCardProps) {
  const [openPopover, setOpenPopover] = useState(false);

  const { mutateAsync: updateMemberRoleService } = useUpdateMemberRoleService();
  const { mutateAsync: deleteMemberService } = useDeleteMemberService();
  const { mutateAsync: transferOwnershipService } =
    useTransferOwnershipService();

  async function updateMemberRole(role: Role) {
    const props = {
      slug,
      memberId,
      role,
    };

    toast.promise(updateMemberRoleService(props), {
      loading: "Atualizando cargo...",
    });
  }

  async function deleteMember() {
    const props = {
      slug,
      memberId,
    };

    toast.promise(deleteMemberService(props), {
      loading: "Deletando membro...",
    });
  }

  async function transferOwnership() {
    const props = {
      slug,
      transferToUserId: memberId,
    };

    toast.promise(transferOwnershipService(props), {
      loading: "Transferindo organização...",
    });
  }

  return {
    openPopover,
    setOpenPopover,
    updateMemberRole,
    transferOwnership,
    deleteMember,
  };
}
