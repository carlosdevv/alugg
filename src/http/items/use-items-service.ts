import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { getItemByIdService, getItemsService } from ".";
import { ErrorResponse } from "../types";
import {
  GetItemByIdProps,
  GetItemProps,
  GetItemResponse,
  GetItemsResponse,
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
  options?: UseQueryOptions<GetItemResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getItemById", props.itemId],
    queryFn: async () =>
      await getItemByIdService({ itemId: props.itemId, slug: props.slug }),
    ...options,
  });
}
