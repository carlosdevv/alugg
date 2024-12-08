import {
  useMutation,
  UseMutationOptions,
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
  ItemProps,
  UpdateItemByIdApiResponse,
  UpdateItemByIdProps,
} from "./types";

export function useGetItemsService(
  props: GetItemProps,
  options?: UseQueryOptions<GetItemsResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getItems", props.slug],
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
  const queryClient = useQueryClient();
  return useMutation<
    UpdateItemByIdApiResponse,
    HTTPError<ErrorResponse>,
    UpdateItemByIdProps
  >({
    mutationFn: async (props: UpdateItemByIdProps) =>
      await updateItemByIdService(props),
    mutationKey: ["updateItemById"],
    onSuccess: (data, variables) => {
      toast.success("Item atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getItems", variables.slug],
      });
    },

    ...options,
  });
}

export function useCreateItemService(
  options?: UseMutationOptions<ItemProps, HTTPError<ErrorResponse>, CreateItemProps>
) {
  const queryClient = useQueryClient();
  return useMutation<ItemProps, HTTPError<ErrorResponse>, CreateItemProps>({
    mutationFn: async (props: CreateItemProps) =>
      await createItemService(props),
    mutationKey: ["createItem"],
    onSuccess: (data, variables) => {
      toast.success("Item criado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getItems", variables.slug],
      });
    },
    ...options,
  });
}

export function useDeleteItemService(
  options?: UseMutationOptions<void, HTTPError<ErrorResponse>, DeleteItemProps>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props) =>
      await deleteItemService({ itemId: props.itemId, slug: props.slug }),
    mutationKey: ["deleteItem"],
    onSuccess: (data, variables) => {
      toast.success("Item deletado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getItems", variables.slug],
      });
    },
    ...options,
  });
}
