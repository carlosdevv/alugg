import { api } from "../api-client";
import type {
  AcceptInviteServiceBody,
  CreateInviteServiceBody,
  CreateInviteServiceResponse,
  GetInvitesServiceApiProps,
  GetInvitesServiceProps,
  GetInvitesServiceResponse,
  PendingInvitesServiceApiProps,
  PendingInvitesServiceProps,
  PendingInvitesServiceResponse,
  RejectInviteServiceBody,
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

export async function pendingInvitesService({
  slug,
}: PendingInvitesServiceProps): Promise<PendingInvitesServiceResponse[]> {
  const result = await api
    .get(`api/organizations/${slug}/invites/pending-invites`)
    .json<PendingInvitesServiceApiProps>();

  return result.invites;
}

export async function acceptInviteService({
  slug,
  inviteId,
}: AcceptInviteServiceBody): Promise<void> {
  return await api
    .post(`api/organizations/${slug}/invites/${inviteId}/accept`)
    .json();
}

export async function rejectInviteService({
  slug,
  inviteId,
}: RejectInviteServiceBody): Promise<void> {
  return await api
    .post(`api/organizations/${slug}/invites/${inviteId}/reject`)
    .json();
}
