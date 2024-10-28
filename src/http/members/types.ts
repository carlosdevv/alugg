import type { Role } from "@/lib/casl/roles";

export type GetMembersServiceApiProps = {
  members: {
    id: string;
    name: string;
    email: string;
    role: Role;
    userId: string;
    isOwner: boolean;
  }[];
};

export type GetMembersServiceResponse = GetMembersServiceApiProps["members"];

export type GetMembersServiceProps = {
  slug: string;
};

export type UpdateMemberRoleServiceBody = {
  slug: string;
  memberId: string;
  role: Role;
};
