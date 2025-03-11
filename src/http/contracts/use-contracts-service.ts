import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { createContractService, getContractsService } from ".";
import type { ErrorResponse } from "../types";
import type {
  CreateContractServiceBody,
  CreateContractServiceResponse,
  GetContractsServiceProps,
  GetContractsServiceResponse,
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

  return useMutation({
    mutationKey: ["createContract"],
    mutationFn: async (body: CreateContractServiceBody) =>
      await createContractService(slug, body),
    onSuccess: () => {
      toast.success("Contrato criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getContracts", slug] });
    },
    onError: async (error) => {
      toast.error(error.message);
    },
    ...options,
  });
}
