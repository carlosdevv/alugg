import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { getCustomersService } from ".";
import type { ErrorResponse } from "../types";
import type {
  GetCustomersServiceProps,
  GetCustomersServiceResponse,
} from "./types";

export function useGetCustomersService(
  props: GetCustomersServiceProps,
  options?: UseQueryOptions<
    GetCustomersServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["getCustomers", props.slug],
    queryFn: async () => await getCustomersService(props),
    ...options,
  });
}
