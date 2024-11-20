import { api } from "../api-client";
import {
  GetItemByIdApiResponse,
  GetItemByIdProps,
  GetItemProps,
  GetItemsApiResponse,
  GetItemsResponse,
} from "./types";

export async function getItemsService({
  slug,
}: GetItemProps): Promise<GetItemsResponse> {
  const result = await api
    .get(`api/organizations/${slug}/items`)
    .json<GetItemsApiResponse>();

  return result.items;
}

export async function getItemByIdService({
  itemId,
  slug,
}: GetItemByIdProps): Promise<GetItemByIdApiResponse> {
  const result = await api
    .get(`api/organizations/${slug}/items/${itemId}`)
    .json<GetItemByIdApiResponse>();

  return result;
}
