import { api } from "../api-client";
import type {
  CreateInviteServiceBody,
  CreateInviteServiceResponse,
  GetInvitesServiceApiProps,
  GetInvitesServiceProps,
  GetInvitesServiceResponse,
  RevokeInviteServiceBody,
} from "./types";

export async function getInvitesService({
  slug,
}: GetInvitesServiceProps): Promise<GetInvitesServiceResponse[]> {
  const result = await api
    .get(`api/organizations/${slug}/invites`)
    .json<GetInvitesServiceApiProps>();

  return result.invites;
}

export async function createInviteService({
  slug,
  email,
  role,
}: CreateInviteServiceBody): Promise<CreateInviteServiceResponse> {
  const result = await api
    .post(`api/organizations/${slug}/invites`, {
      json: { email, role },
    })
    .json<CreateInviteServiceResponse>();

  return result;
}

export async function revokeInviteService({
  slug,
  inviteId,
}: RevokeInviteServiceBody): Promise<void> {
  const result = await api
    .delete(`api/organizations/${slug}/invites/${inviteId}`)
    .json<void>();

  return result;
}
