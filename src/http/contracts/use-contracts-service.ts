import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { getContractsService } from ".";
import type { ErrorResponse } from "../types";
import type {
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
