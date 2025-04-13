import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { HTTPError } from "ky";
import { toast } from "sonner";
import {
  createItemService,
  deleteItemService,
  getItemByIdService,
  getItemHistoryService,
  getItemsAvailabilityService,
  getItemsService,
  updateItemByIdService,
} from ".";
import { ErrorResponse } from "../types";
import {
  type CreateItemServiceBody,
  type CreateItemServiceResponse,
  type DeleteItemServiceProps,
  type GetItemByIdApiResponse,
  type GetItemByIdServiceProps,
  type GetItemHistoryServiceProps,
  type GetItemHistoryServiceResponse,
  type GetItemsAvailabilityServiceProps,
  type GetItemsAvailabilityServiceResponse,
  type GetItemServiceProps,
  type GetItemsServiceResponse,
  type UpdateItemByIdApiResponse,
  type UpdateItemByIdServiceBody,
  type UpdateItemByIdServiceProps,
} from "./types";

export function useGetItemsService(
  props: GetItemServiceProps,
  options?: UseQueryOptions<GetItemsServiceResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getItems", props.slug, props.page, props.limit, props.itemName],
    queryFn: async () => await getItemsService(props),
    ...options,
  });
}

export function useGetItemByIdService(
  props: GetItemByIdServiceProps,
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
  props: UpdateItemByIdServiceProps,
  options?: UseMutationOptions<
    UpdateItemByIdApiResponse,
    HTTPError<ErrorResponse>,
    UpdateItemByIdServiceBody
  >
) {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateItemByIdApiResponse,
    HTTPError<ErrorResponse>,
    UpdateItemByIdServiceBody
  >({
    mutationFn: async (body: UpdateItemByIdServiceBody) =>
      await updateItemByIdService(props, body),
    mutationKey: ["updateItemById"],
    onSuccess: () => {
      toast.success("Item atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getItems", props.slug],
      });
    },

    ...options,
  });
}

export function useCreateItemService(
  props: { slug: string },
  options?: UseMutationOptions<
    CreateItemServiceResponse,
    HTTPError<ErrorResponse>,
    CreateItemServiceBody
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    CreateItemServiceResponse,
    HTTPError<ErrorResponse>,
    CreateItemServiceBody
  >({
    mutationFn: async (body: CreateItemServiceBody) =>
      await createItemService(props, body),
    mutationKey: ["createItem"],
    onSuccess: () => {
      toast.success("Item criado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getItems", props.slug],
      });
    },
    ...options,
  });
}

export function useDeleteItemService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    DeleteItemServiceProps
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props) =>
      await deleteItemService({ itemId: props.itemId, slug: props.slug }),
    mutationKey: ["deleteItem"],
    onSuccess: (_, variables) => {
      toast.success("Item deletado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getItems", variables.slug],
      });
    },
    ...options,
  });
}

export function useGetItemsAvailabilityService(
  props: GetItemsAvailabilityServiceProps,
  options?: UseQueryOptions<
    GetItemsAvailabilityServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: [
      "getItemsAvailability",
      props.slug,
      props.eventDate,
      props.withdrawalDate,
      props.returnDate,
    ],
    queryFn: async () => await getItemsAvailabilityService(props),
    enabled: !!props.eventDate && !!props.withdrawalDate && !!props.returnDate,
    ...options,
  });
}

export function useGetItemHistoryService(
  props: GetItemHistoryServiceProps,
  options?: UseQueryOptions<
    GetItemHistoryServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["getItemHistory", props.itemId],
    queryFn: async () => await getItemHistoryService(props),
    enabled: !!props.itemId,
    ...options,
  });
}
