"use client";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useParams } from "next/navigation";
import { getSubscriptionService, upgradeSubscriptionService } from ".";
import type { ErrorResponse } from "../types";
import type {
  GetSubscriptionServiceResponse,
  UpgradeSubscriptionServiceBody,
  UpgradeSubscriptionServiceResponse,
} from "./types";

export function useUpgradeSubscriptionService(
  options?: UseMutationOptions<
    UpgradeSubscriptionServiceResponse,
    HTTPError<ErrorResponse>,
    UpgradeSubscriptionServiceBody
  >
) {
  const { slug } = useParams<{ slug: string }>();

  return useMutation({
    mutationKey: ["upgrade-subscription", slug],
    mutationFn: async (body: UpgradeSubscriptionServiceBody) =>
      upgradeSubscriptionService({ slug, body }),
    ...options,
  });
}

export function useGetSubscriptionService(
  options?: UseQueryOptions<
    GetSubscriptionServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  const { slug } = useParams<{ slug: string }>();

  return useQuery({
    queryKey: ["get-subscription", slug],
    queryFn: async () => getSubscriptionService({ slug }),
    ...options,
  });
}
