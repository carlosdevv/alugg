import { api } from "../api-client";
import type {
  DashboardStatsServiceResponse,
  UseGetDashboardStatsServiceProps,
} from "./types";

export async function getDashboardStatsService({
  slug,
}: UseGetDashboardStatsServiceProps) {
  const url = `api/organizations/${slug}/stats`;

  const result = await api.get<DashboardStatsServiceResponse>(url).json();

  return result;
}
