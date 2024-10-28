import { api } from "../api-client";
import type {
  GetMembersServiceApiProps,
  GetMembersServiceProps,
  GetMembersServiceResponse,
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
