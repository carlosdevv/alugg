import { useUpdateMemberRoleService } from "@/http/members/use-members-service";
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

  return { openPopover, setOpenPopover, updateMemberRole };
}
