import { api } from "../api-client";
import type {
  CreateContractServiceBody,
  CreateContractServiceResponse,
  GetContractsServiceProps,
  GetContractsServiceResponse,
} from "./types";

export async function getContractsService({
  slug,
}: GetContractsServiceProps): Promise<GetContractsServiceResponse> {
  const url = `api/organizations/${slug}/contracts`;

  const result = await api.get(url).json<GetContractsServiceResponse>();

  return result;
}

export async function createContractService(
  slug: string,
  body: CreateContractServiceBody
): Promise<CreateContractServiceResponse> {
  const url = `api/organizations/${slug}/contracts`;

  const result = await api
    .post(url, {
      json: body,
    })
    .json<CreateContractServiceResponse>();
  return result;
}
