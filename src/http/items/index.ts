import { api } from "../api-client";
import {
  type CreateItemServiceBody,
  type CreateItemServiceResponse,
  type DeleteItemServiceProps,
  type GetItemByIdApiResponse,
  type GetItemByIdServiceProps,
  type GetItemServiceProps,
  type GetItemsApiResponse,
  type GetItemsServiceResponse,
  type UpdateItemByIdApiResponse,
  type UpdateItemByIdServiceBody,
  type UpdateItemByIdServiceProps,
} from "./types";

export async function getItemsService({
  slug,
}: GetItemServiceProps): Promise<GetItemsServiceResponse> {
  const result = await api
    .get(`api/organizations/${slug}/items`)
    .json<GetItemsApiResponse>();

  return result.items;
}

export async function getItemByIdService({
  itemId,
  slug,
}: GetItemByIdServiceProps): Promise<GetItemByIdApiResponse> {
  const result = await api
    .get(`api/organizations/${slug}/items/${itemId}`)
    .json<GetItemByIdApiResponse>();

  return result;
}

export async function updateItemByIdService(
  { id, slug }: UpdateItemByIdServiceProps,
  body: UpdateItemByIdServiceBody
): Promise<UpdateItemByIdApiResponse> {
  return await api
    .patch(`api/organizations/${slug}/items/${id}`, {
      json: body,
    })
    .json<UpdateItemByIdApiResponse>();
}

export async function createItemService(
  props: { slug: string },
  body: CreateItemServiceBody
) {
  const item = await api
    .post(`api/organizations/${props.slug}/items`, {
      json: body,
    })
    .json<CreateItemServiceResponse>();

  return item;
}

export async function deleteItemService({
  itemId,
  slug,
}: DeleteItemServiceProps) {
  await api.delete(`api/organizations/${slug}/items/${itemId}`);
  return;
}
