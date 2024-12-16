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
  DeleteItemServiceProps,
  GetItemByIdApiResponse,
  GetItemByIdServiceProps,
  GetItemServiceProps,
  GetItemsServiceResponse,
  UpdateItemByIdApiResponse,
  UpdateItemByIdServiceProps,
  type CreateItemServiceBody,
  type CreateItemServiceResponse,
  type UpdateItemByIdServiceBody,
} from "./types";

export function useGetItemsService(
  props: GetItemServiceProps,
  options?: UseQueryOptions<GetItemsServiceResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getItems", props.slug],
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
