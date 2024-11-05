import { api } from "../api-client";
import type {
  GetInvitesServiceApiProps,
  GetInvitesServiceProps,
  GetInvitesServiceResponse,
} from "./types";

export async function getInvitesService({
  slug,
}: GetInvitesServiceProps): Promise<GetInvitesServiceResponse[]> {
  const result = await api
    .get(`api/organizations/${slug}/invites`)
    .json<GetInvitesServiceApiProps>();

  return result.invites;
}
