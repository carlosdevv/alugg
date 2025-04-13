import { appRoutes } from "@/lib/constants";
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createContractService,
  deleteContractService,
  getContractByIdService,
  getContractSettingsService,
  getContractsService,
  getNextContractCodeService,
  returnContractService,
  updateContractService,
  updateContractSettingsService,
  withdrawalContractService,
} from ".";
import type { ErrorResponse } from "../types";
import type {
  CreateContractServiceBody,
  CreateContractServiceResponse,
  GetContractByIdServiceProps,
  GetContractByIdServiceResponse,
  GetContractSettingsServiceResponse,
  GetContractsServiceProps,
  GetContractsServiceResponse,
  GetNextContractCodeServiceProps,
  GetNextContractCodeServiceResponse,
  ReturnContractServiceBody,
  ReturnContractServiceResponse,
  UpdateContractServiceBody,
  UpdateContractServiceResponse,
  UpdateContractSettingsServiceBody,
  UpdateContractSettingsServiceResponse,
  WithdrawalContractServiceBody,
  WithdrawalContractServiceResponse,
} from "./types";

export function useGetContractsService(
  props: GetContractsServiceProps,
  options?: UseQueryOptions<
    GetContractsServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: [
      "getContracts",
      props.slug,
      props.status,
      props.page,
      props.limit,
    ],
    queryFn: async () => await getContractsService(props),
    ...options,
  });
}

export function useGetContractByIdService(
  props: GetContractByIdServiceProps,
  options?: UseQueryOptions<
    GetContractByIdServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["getContractById", props.slug, props.contractId],
    queryFn: async () => await getContractByIdService(props),
    ...options,
  });
}

export function useCreateContractService(
  options?: UseMutationOptions<
    CreateContractServiceResponse,
    HTTPError<ErrorResponse>,
    CreateContractServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  return useMutation({
    mutationKey: ["createContract"],
    mutationFn: async (body: CreateContractServiceBody) =>
      await createContractService(slug, body),
    onSuccess: () => {
      toast.success("Contrato criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getContracts", slug] });
      router.push(`/${slug}/${appRoutes.contracts.root}`);
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useGetNextContractCodeService(
  props: GetNextContractCodeServiceProps,
  options?: UseQueryOptions<
    GetNextContractCodeServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["getNextContractCode", props.slug],
    queryFn: async () => await getNextContractCodeService(props.slug),
    ...options,
  });
}

export function useDeleteContractService(
  options?: UseMutationOptions<void, HTTPError<ErrorResponse>, string>
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["deleteContract"],
    mutationFn: async (contractId: string) =>
      await deleteContractService(slug, contractId),
    onSuccess: () => {
      toast.success("Contrato deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getContracts", slug] });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useUpdateContractService(
  options?: UseMutationOptions<
    UpdateContractServiceResponse,
    HTTPError<ErrorResponse>,
    UpdateContractServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["updateContract", slug],
    mutationFn: async (body: UpdateContractServiceBody) =>
      await updateContractService(slug, body),
    onSuccess: () => {
      toast.success("Contrato atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getContracts", slug] });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useWithdrawalContractService(
  options?: UseMutationOptions<
    WithdrawalContractServiceResponse,
    HTTPError<ErrorResponse>,
    WithdrawalContractServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["withdrawalContract", slug],
    mutationFn: async (body: WithdrawalContractServiceBody) =>
      await withdrawalContractService({ slug, body }),
    onSuccess: () => {
      toast.success("Retirada de contrato realizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getContracts", slug] });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useReturnContractService(
  options?: UseMutationOptions<
    ReturnContractServiceResponse,
    HTTPError<ErrorResponse>,
    ReturnContractServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["returnContract", slug],
    mutationFn: async (body: ReturnContractServiceBody) =>
      await returnContractService({ slug, body }),
    onSuccess: () => {
      toast.success("Devolução de contrato realizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getContracts", slug] });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useGetContractSettingsService(
  options?: UseQueryOptions<
    GetContractSettingsServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  const { slug } = useParams() as { slug: string };

  return useQuery({
    queryKey: ["getContractSettings", slug],
    queryFn: async () => await getContractSettingsService(slug),
    ...options,
  });
}

export function useUpdateContractSettingsService(
  options?: UseMutationOptions<
    UpdateContractSettingsServiceResponse,
    HTTPError<ErrorResponse>,
    UpdateContractSettingsServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["updateContractSettings", slug],
    mutationFn: async (body: UpdateContractSettingsServiceBody) =>
      await updateContractSettingsService(slug, body),
    onSuccess: () => {
      toast.success("Configurações de contrato atualizadas com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getContractSettings", slug],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}
