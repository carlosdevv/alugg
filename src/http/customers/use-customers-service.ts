import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { toast } from "sonner";
import {
  createCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomersService,
  updateCustomerService,
} from ".";
import type { ErrorResponse } from "../types";
import type {
  CreateCustomerServiceBody,
  CreateCustomerServiceResponse,
  DeleteCustomerServiceBody,
  GetCustomerByIdServiceProps,
  GetCustomerByIdServiceResponse,
  GetCustomersServiceProps,
  GetCustomersServiceResponse,
  UpdateCustomerResponse,
  UpdateCustomerServiceBody,
  UpdateCustomerServiceProps,
} from "./types";

export function useGetCustomersService(
  props: GetCustomersServiceProps,
  options?: UseQueryOptions<
    GetCustomersServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: [
      "getCustomers",
      props.slug,
      props.page,
      props.limit,
      props.customerName,
    ],
    queryFn: async () => await getCustomersService(props),
    ...options,
  });
}

export function useGetCustomerByIdService(
  props: GetCustomerByIdServiceProps,
  options?: UseQueryOptions<
    GetCustomerByIdServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["getCustomerById", props.customerId],
    queryFn: async () =>
      await getCustomerByIdService({
        customerId: props.customerId,
        slug: props.slug,
      }),
    ...options,
  });
}

export function useCreateCustomerService(
  props: { slug: string },
  options?: UseMutationOptions<
    CreateCustomerServiceResponse,
    HTTPError<ErrorResponse>,
    CreateCustomerServiceBody
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCustomer", props.slug],
    mutationFn: async (body: CreateCustomerServiceBody) =>
      await createCustomerService(props.slug, body),
    onSuccess: () => {
      toast.success("Cliente criado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getCustomers", props.slug],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useDeleteCustomerService(
  props: { slug: string },
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    DeleteCustomerServiceBody
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCustomer"],
    mutationFn: async (body: DeleteCustomerServiceBody) =>
      await deleteCustomerService(props, body),
    onSuccess: () => {
      toast.success("Cliente deletado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getCustomers", props.slug],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useUpdateCustomerService(
  props: UpdateCustomerServiceProps,
  options?: UseMutationOptions<
    UpdateCustomerResponse,
    HTTPError<ErrorResponse>,
    UpdateCustomerServiceBody
  >
) {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateCustomerResponse,
    HTTPError<ErrorResponse>,
    UpdateCustomerServiceBody
  >({
    mutationFn: async (body: UpdateCustomerServiceBody) =>
      await updateCustomerService(props, body),
    mutationKey: ["updateCustomerService"],
    onSuccess: () => {
      toast.success("Cliente atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getCustomers", props.slug],
      });
    },

    ...options,
  });
}
