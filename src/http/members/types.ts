import type { Role } from "@/lib/casl/roles";

export type MemberProps = {
  id: string;
  name: string;
  email: string;
  role: Role;
  userId: string;
  isOwner: boolean;
};

export type GetMembersServiceApiProps = {
  members: MemberProps[];
};

export type GetMembersServiceResponse = MemberProps[];

export type GetMembersServiceProps = {
  slug: string;
};

export type GetMemberByIdServiceResponse = {
  memberId: string;
  name: string;
  userId: string;
};

export type GetMemberByIdServiceProps = {
  slug: string;
  memberId: string;
};

export type UpdateMemberRoleServiceBody = {
  slug: string;
  memberId: string;
  role: Role;
};

export type DeleteMemberServiceBody = {
  slug: string;
  memberId: string;
};

export type TransferOwnershipServiceBody = {
  slug: string;
  transferToUserId: string;
};
