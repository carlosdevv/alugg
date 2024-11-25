import { api } from "../api-client";
import {
  CreateItemProps,
  GetItemByIdApiResponse,
  GetItemByIdProps,
  GetItemProps,
  GetItemsApiResponse,
  GetItemsResponse,
  Item,
  UpdateItemByIdApiResponse,
  UpdateItemByIdProps,
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

export async function updateItemByIdService({
  id,
  slug,
  updatedItem,
}: UpdateItemByIdProps): Promise<UpdateItemByIdApiResponse> {
  console.log(`updateItemByIdService update itemById: ${updatedItem} `);

  return await api
    .patch(`api/organizations/${slug}/items/${id}`, {
      json: updatedItem,
    })
    .json<UpdateItemByIdApiResponse>();
}

export async function createItemService({
  slug,
  itemToCreate,
}: CreateItemProps) {
  const item = await api
    .post(`api/organizations/${slug}/items`, {
      json: itemToCreate,
    })
    .json<Item>();

  return item;
}

export async function deleteItemService({ itemId, slug }: GetItemByIdProps) {
  await api.delete(`api/organizations/${slug}/items/${itemId}`);
}
