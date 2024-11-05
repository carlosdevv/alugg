import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { getInvitesService } from ".";
import type { ErrorResponse } from "../types";
import type {
  GetInvitesServiceProps,
  GetInvitesServiceResponse,
} from "./types";

export function useGetInvitesService(
  props: GetInvitesServiceProps,
  options?: UseQueryOptions<
    GetInvitesServiceResponse[],
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["getInvites", props.slug],
    queryFn: async () => await getInvitesService(props),
    ...options,
  });
}
