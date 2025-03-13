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
  getContractsService,
  getNextContractCodeService,
} from ".";
import type { ErrorResponse } from "../types";
import type {
  CreateContractServiceBody,
  CreateContractServiceResponse,
  GetContractsServiceProps,
  GetContractsServiceResponse,
  GetNextContractCodeServiceProps,
  GetNextContractCodeServiceResponse,
} from "./types";

export function useGetContractsService(
  props: GetContractsServiceProps,
  options?: UseQueryOptions<
    GetContractsServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["getContracts", props.slug],
    queryFn: async () => await getContractsService(props),
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
