import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getDashboardStatsService } from ".";
import {
  UseGetDashboardStatsServiceProps,
  type DashboardStatsServiceResponse,
} from "./types";
import type { HTTPError } from "ky";
import type { ErrorResponse } from "../types";

export function useGetDashboardStatsService(
  props: UseGetDashboardStatsServiceProps,
  options?: UseQueryOptions<
    DashboardStatsServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["dashboard-stats", props.slug],
    queryFn: async () => getDashboardStatsService(props),
    enabled: !!props.slug,
    ...options,
  });
}
