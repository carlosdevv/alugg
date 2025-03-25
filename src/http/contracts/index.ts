import { api } from "../api-client";
import type {
  CreateContractServiceBody,
  CreateContractServiceResponse,
  GetContractByIdServiceProps,
  GetContractByIdServiceResponse,
  GetContractSettingsServiceResponse,
  GetContractsServiceProps,
  GetContractsServiceResponse,
  GetNextContractCodeServiceResponse,
  ReturnContractServiceBody,
  ReturnContractServiceResponse,
  UpdateContractServiceBody,
  UpdateContractServiceResponse,
  UpdateContractSettingsServiceBody,
  UpdateContractSettingsServiceResponse,
  WithdrawalContractServiceBody,
  WithdrawalContractServiceResponse,
} from "./types";

export async function getContractsService({
  slug,
  status,
}: GetContractsServiceProps): Promise<GetContractsServiceResponse> {
  const url = `api/organizations/${slug}/contracts?status=${status}`;

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

export async function updateContractService(
  slug: string,
  body: UpdateContractServiceBody
): Promise<UpdateContractServiceResponse> {
  const { contractId, ...rest } = body;
  const url = `api/organizations/${slug}/contracts/${contractId}`;

  const result = await api
    .put(url, {
      json: rest,
    })
    .json<UpdateContractServiceResponse>();

  return result;
}

export async function withdrawalContractService({
  slug,
  body,
}: {
  slug: string;
  body: WithdrawalContractServiceBody;
}): Promise<WithdrawalContractServiceResponse> {
  const url = `api/organizations/${slug}/contracts/${body.contractId}/withdrawal`;

  const result = await api
    .post(url, {
      json: body,
    })
    .json<WithdrawalContractServiceResponse>();

  return result;
}

export async function returnContractService({
  slug,
  body,
}: {
  slug: string;
  body: ReturnContractServiceBody;
}): Promise<ReturnContractServiceResponse> {
  const url = `api/organizations/${slug}/contracts/${body.contractId}/return`;

  const result = await api
    .post(url, {
      json: body,
    })
    .json<ReturnContractServiceResponse>();

  return result;
}

export async function getContractSettingsService(
  slug: string
): Promise<GetContractSettingsServiceResponse> {
  const url = `api/organizations/${slug}/contracts/settings`;

  const result = await api.get(url).json<GetContractSettingsServiceResponse>();

  return result;
}

export async function updateContractSettingsService(
  slug: string,
  body: UpdateContractSettingsServiceBody
): Promise<UpdateContractSettingsServiceResponse> {
  const url = `api/organizations/${slug}/contracts/settings`;

  const result = await api
    .patch(url, { json: body })
    .json<UpdateContractSettingsServiceResponse>();

  return result;
}
