import { api } from "../api-client";
import type {
  CreateOrganizationServiceBody,
  CreateOrganizationServiceResponse,
  DeleteOrganizationServiceBody,
  FetchExistentSlugServiceProps,
  FetchExistentSlugServiceResponse,
  GetOrganizationApiProps,
  GetOrganizationResponse,
  GetOrganizationsApiProps,
  GetOrganizationServiceProps,
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
}: GetOrganizationServiceProps): Promise<GetOrganizationResponse> {
  const result = await api
    .get(`api/organizations/${slug}`)
    .json<GetOrganizationApiProps>();

  return result.organization;
}

export async function createOrganizationService({
  name,
  slug,
  plan,
}: CreateOrganizationServiceBody): Promise<CreateOrganizationServiceResponse> {
  return await api
    .post("api/organizations", {
      json: {
        name,
        slug,
        plan,
      },
    })
    .json<CreateOrganizationServiceResponse>();
}

export async function updateOrganizationService(
  { slug }: { slug: string },
  body: UpdateOrganizationServiceBody
): Promise<UpdateOrganizationServiceResponse> {
  return await api
    .patch(`api/organizations/${slug}`, {
      json: {
        ...body,
      },
    })
    .json<UpdateOrganizationServiceResponse>();
}

export async function fetchExistentSlugService({
  slug,
}: FetchExistentSlugServiceProps): Promise<FetchExistentSlugServiceResponse> {
  const response = await api
    .get(`api/organizations/${slug}/exists`)
    .json<FetchExistentSlugServiceResponse>();

  return response;
}

export async function deleteOrganizationService({
  slug,
}: DeleteOrganizationServiceBody): Promise<void> {
  await api.delete(`api/organizations/${slug}`);
}
