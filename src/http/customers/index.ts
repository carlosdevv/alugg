import { api } from "../api-client";
import type {
  CreateCustomerServiceBody,
  CreateCustomerServiceResponse,
  DeleteCustomerServiceBody,
  GetCustomerByIdServiceProps,
  GetCustomerByIdServiceResponse,
  GetCustomersServiceProps,
  GetCustomersServiceResponse,
  UpdateCustomerResponse,
  UpdateCustomerServiceBody,
  UpdateCustomerServiceProps,
} from "./types";

export async function getCustomersService({
  slug,
  page = 1,
  limit = 10,
  customerName,
}: GetCustomersServiceProps): Promise<GetCustomersServiceResponse> {
  const params = new URLSearchParams();

  if (customerName) {
    params.append("customerName", customerName);
  }
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const url = `api/organizations/${slug}/customers?${params.toString()}`;

  const result = await api.get(url).json<GetCustomersServiceResponse>();

  return result;
}

export async function getCustomerByIdService({
  slug,
  customerId,
}: GetCustomerByIdServiceProps): Promise<GetCustomerByIdServiceResponse> {
  const result = await api
    .get(`api/organizations/${slug}/customers/${customerId}`)
    .json<GetCustomerByIdServiceResponse>();

  return result;
}

export async function createCustomerService(
  slug: string,
  body: CreateCustomerServiceBody
): Promise<CreateCustomerServiceResponse> {
  const result = await api
    .post(`api/organizations/${slug}/customers`, {
      json: body,
    })
    .json<CreateCustomerServiceResponse>();

  return result;
}

export async function deleteCustomerService(
  props: { slug: string },
  { customerId }: DeleteCustomerServiceBody
): Promise<void> {
  await api
    .delete(`api/organizations/${props.slug}/customers/${customerId}`)
    .json();
}

export async function updateCustomerService(
  { customerId, slug }: UpdateCustomerServiceProps,
  body: UpdateCustomerServiceBody
): Promise<UpdateCustomerResponse> {
  return await api
    .patch(`api/organizations/${slug}/customers/${customerId}`, {
      json: body,
    })
    .json<UpdateCustomerResponse>();
}
