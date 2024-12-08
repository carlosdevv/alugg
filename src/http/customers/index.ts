import { api } from "../api-client";
import type {
  GetCustomersServiceProps,
  GetCustomersServiceResponse,
} from "./types";

export async function getCustomersService({
  slug,
}: GetCustomersServiceProps): Promise<GetCustomersServiceResponse> {
  const result = await api
    .get(`api/organizations/${slug}/customers`)
    .json<GetCustomersServiceResponse>();

  return result;
}
