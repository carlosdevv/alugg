import { api } from "../api-client";
import type {
  GetContractsServiceProps,
  GetContractsServiceResponse,
} from "./types";

export async function getContractsService({
  slug,
}: GetContractsServiceProps): Promise<GetContractsServiceResponse> {
  const result = await api
    .get(`api/organizations/${slug}/contracts`)
    .json<GetContractsServiceResponse>();

  return result;
}
