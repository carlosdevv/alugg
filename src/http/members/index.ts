import { api } from "../api-client";
import type {
  DeleteMemberServiceBody,
  GetMembersServiceApiProps,
  GetMembersServiceProps,
  GetMembersServiceResponse,
  TransferOwnershipServiceBody,
  UpdateMemberRoleServiceBody,
} from "./types";

export async function getMembersService({
  slug,
}: GetMembersServiceProps): Promise<GetMembersServiceResponse> {
  const result = await api
    .get(`api/organizations/${slug}/members`)
    .json<GetMembersServiceApiProps>();

  return result.members;
}

export async function updateMemberRoleService({
  slug,
  memberId,
  role,
}: UpdateMemberRoleServiceBody): Promise<void> {
  return await api
    .put(`api/organizations/${slug}/members/${memberId}`, {
      json: {
        role,
      },
    })
    .json<void>();
}

export async function deleteMemberService({
  slug,
  memberId,
}: DeleteMemberServiceBody): Promise<void> {
  return await api
    .delete(`api/organizations/${slug}/members/${memberId}`)
    .json<void>();
}

export async function transferOwnershipService({
  slug,
  transferToUserId,
}: TransferOwnershipServiceBody): Promise<void> {
  return await api
    .patch(`api/organizations/${slug}/owner`, {
      json: {
        transferToUserId,
      },
    })
    .json<void>();
}
