import { api } from "../api-client";
import type {
  CreateContractServiceBody,
  CreateContractServiceResponse,
  GetContractByIdServiceProps,
  GetContractByIdServiceResponse,
  GetContractsServiceProps,
  GetContractsServiceResponse,
  GetNextContractCodeServiceResponse,
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

export async function getNextContractCodeService(
  slug: string
): Promise<GetNextContractCodeServiceResponse> {
  const url = `api/organizations/${slug}/contracts/next-code`;

  const result = await api.get(url).json<GetNextContractCodeServiceResponse>();

  return result;
}

export async function deleteContractService(
  slug: string,
  contractId: string
): Promise<void> {
  const url = `api/organizations/${slug}/contracts/${contractId}`;

  await api.delete(url);
}

export async function getContractByIdService({
  slug,
  contractId,
}: GetContractByIdServiceProps): Promise<GetContractByIdServiceResponse> {
  const url = `api/organizations/${slug}/contracts/${contractId}`;

  const result = await api.get(url).json<GetContractByIdServiceResponse>();

  return result;
}
