import { api } from "../api-client";
import {
  GetItemsAvailabilityServiceProps,
  GetItemsAvailabilityServiceResponse,
  type CreateItemServiceBody,
  type CreateItemServiceResponse,
  type DeleteItemServiceProps,
  type GetItemByIdApiResponse,
  type GetItemByIdServiceProps,
  type GetItemHistoryServiceProps,
  type GetItemHistoryServiceResponse,
  type GetItemServiceProps,
  type GetItemsServiceResponse,
  type UpdateItemByIdApiResponse,
  type UpdateItemByIdServiceBody,
  type UpdateItemByIdServiceProps,
} from "./types";

export async function getItemsService({
  slug,
  page = 1,
  limit = 10,
  itemName,
}: GetItemServiceProps): Promise<GetItemsServiceResponse> {
  const params = new URLSearchParams();

  if (itemName) {
    params.append("itemName", itemName);
  }
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const url = `api/organizations/${slug}/items?${params.toString()}`;

  const response = await api.get(url).json<GetItemsServiceResponse>();
  return response;
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

export async function getItemsAvailabilityService({
  slug,
  eventDate,
  withdrawalDate,
  returnDate,
}: GetItemsAvailabilityServiceProps): Promise<GetItemsAvailabilityServiceResponse> {
  const url = `api/organizations/${slug}/items/availability`;

  const response = await api
    .get(url, {
      searchParams: {
        eventDate,
        withdrawalDate,
        returnDate,
      },
    })
    .json<GetItemsAvailabilityServiceResponse>();

  return response;
}

export async function getItemHistoryService({
  slug,
  itemId,
}: GetItemHistoryServiceProps): Promise<GetItemHistoryServiceResponse> {
  const url = `api/organizations/${slug}/items/${itemId}/history`;

  const response = await api.get(url).json<GetItemHistoryServiceResponse>();

  return response;
}
