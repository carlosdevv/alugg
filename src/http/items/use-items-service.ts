import {
  useMutation,
  UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { HTTPError } from "ky";
import {
  createItemService,
  deleteItemService,
  getItemByIdService,
  getItemsService,
  updateItemByIdService,
} from ".";
import { ErrorResponse } from "../types";
import {
  CreateItemProps,
  DeleteItemProps,
  GetItemByIdApiResponse,
  GetItemByIdProps,
  GetItemProps,
  GetItemsResponse,
  Item,
  UpdateItemByIdApiResponse,
  UpdateItemByIdProps,
} from "./types";

export function useGetItemsService(
  props: GetItemProps,
  options?: UseQueryOptions<GetItemsResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getCategories", props.slug],
    queryFn: async () => await getItemsService(props),
    ...options,
  });
}

export function useGetItemByIdService(
  props: GetItemByIdProps,
  options?: UseQueryOptions<GetItemByIdApiResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getItemById", props.itemId],
    queryFn: async () =>
      await getItemByIdService({ itemId: props.itemId, slug: props.slug }),
    ...options,
  });
}

export function useUpdateItemByIdService(
  options?: UseMutationOptions<
    UpdateItemByIdApiResponse,
    HTTPError<ErrorResponse>,
    UpdateItemByIdProps
  >
) {
  return useMutation<
    UpdateItemByIdApiResponse,
    HTTPError<ErrorResponse>,
    UpdateItemByIdProps
  >({
    mutationFn: async (props: UpdateItemByIdProps) =>
      await updateItemByIdService(props),
    mutationKey: ["updateItemById"],
    ...options,
  });
}

export function useCreateItemService(
  options?: UseMutationOptions<Item, HTTPError<ErrorResponse>, CreateItemProps>
) {
  return useMutation<Item, HTTPError<ErrorResponse>, CreateItemProps>({
    mutationFn: async (props: CreateItemProps) =>
      await createItemService(props),
    mutationKey: ["createItem"],
    ...options,
  });
}

export function useDeleteItemService(
  options?: UseMutationOptions<void, HTTPError<ErrorResponse>, DeleteItemProps>
) {
  return useMutation({
    mutationFn: async (props) =>
      deleteItemService({ itemId: props.itemId, slug: props.slug }),
    mutationKey: ["deleteItem"],
    ...options,
  });
}
