import { api } from "../api-client";
import type {
  GetSubscriptionServiceResponse,
  UpgradeSubscriptionServiceBody,
  UpgradeSubscriptionServiceResponse,
} from "./types";

export async function upgradeSubscriptionService({
  slug,
  body,
}: {
  slug: string;
  body: UpgradeSubscriptionServiceBody;
}) {
  const url = `api/organizations/${slug}/billing/subscription`;

  const result = await api
    .put(url, { json: body })
    .json<UpgradeSubscriptionServiceResponse>();

  return result;
}

export async function getSubscriptionService({ slug }: { slug: string }) {
  const url = `api/organizations/${slug}/billing/subscription`;

  const result = await api.get(url).json<GetSubscriptionServiceResponse>();

  return result;
}
