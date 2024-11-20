import { api } from "../api-client";
import {
  GetItemByIdApiResponse,
  GetItemByIdProps,
  GetItemProps,
  GetItemResponse,
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
}: GetItemByIdProps): Promise<GetItemResponse> {
  const route = `/api/organizations/${slug}/items/${itemId}`;

  console.log(`item route: ${route}`);

  const result = await api.get(route).json<GetItemByIdApiResponse>();

  console.log(`GetItemById response: ${result.item}`);

  return result.item;
}
