import { api } from "../api-client";
import type {
  CreateOrganizationServiceBody,
  CreateOrganizationServiceResponse,
  FetchExistentSlugServiceProps,
  FetchExistentSlugServiceResponse,
  GetMembershipProps,
  GetMembershipResponse,
  GetOrganizationApiProps,
  GetOrganizationProps,
  GetOrganizationResponse,
  GetOrganizationsApiProps,
  GetOrganizationsResponse,
  UpdateOrganizationServiceBody,
  UpdateOrganizationServiceResponse,
} from "./types";

export async function getOrganizationsService(): Promise<GetOrganizationsResponse> {
  const result = await api
    .get("api/organizations")
    .json<GetOrganizationsApiProps>();

  return result.organizations;
}

export async function getOrganizationService({
  slug,
}: GetOrganizationProps): Promise<GetOrganizationResponse> {
  const result = await api
    .get(`api/organizations/${slug}`)
    .json<GetOrganizationApiProps>();

  return result.organization;
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

export async function updateOrganizationService({
  name,
  slug,
  newSlug,
}: UpdateOrganizationServiceBody): Promise<UpdateOrganizationServiceResponse> {
  return await api
    .patch(`api/organizations/${slug}`, {
      json: {
        name,
        newSlug,
      },
    })
    .json<UpdateOrganizationServiceResponse>();
}

export async function getMembershipService({
  org,
}: GetMembershipProps): Promise<GetMembershipResponse> {
  const result = await api
    .get(`organization/${org}/membership`)
    .json<GetMembershipResponse>();

  return result;
}

export async function fetchExistentSlugService({
  slug,
}: FetchExistentSlugServiceProps): Promise<FetchExistentSlugServiceResponse> {
  const response = await api
    .get(`api/organizations/${slug}/exists`)
    .json<FetchExistentSlugServiceResponse>();

  return response;
}
