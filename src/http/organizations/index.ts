import { api } from "../api-client";
import type {
  CreateOrganizationServiceBody,
  CreateOrganizationServiceResponse,
  GetMembershipProps,
  GetMembershipResponse,
  GetOrganizationsApiProps,
  GetOrganizationsResponse,
} from "./types";

export async function getOrganizationsService(): Promise<GetOrganizationsResponse> {
  const result = await api
    .get("api/organizations")
    .json<GetOrganizationsApiProps>();

  return result.organizations;
}

export async function createOrganizationService({
  name,
  plan,
}: CreateOrganizationServiceBody): Promise<CreateOrganizationServiceResponse> {
  return await api
    .post("api/organizations", {
      json: {
        name,
        plan,
      },
    })
    .json<CreateOrganizationServiceResponse>();
}

export async function getMembershipService({
  org,
}: GetMembershipProps): Promise<GetMembershipResponse> {
  const result = await api
    .get(`organization/${org}/membership`)
    .json<GetMembershipResponse>();

  return result;
}
