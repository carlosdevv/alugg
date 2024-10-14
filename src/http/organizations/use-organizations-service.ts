import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createOrganizationService,
  fetchExistentSlugService,
  getOrganizationService,
  getOrganizationsService,
  updateOrganizationService,
} from ".";
import type { ErrorResponse } from "../types";
import type {
  CreateOrganizationServiceBody,
  CreateOrganizationServiceResponse,
  FetchExistentSlugServiceProps,
  FetchExistentSlugServiceResponse,
  GetOrganizationProps,
  GetOrganizationResponse,
  GetOrganizationsResponse,
  UpdateOrganizationServiceBody,
  UpdateOrganizationServiceResponse,
} from "./types";

export function useGetOrganizationsService(
  options?: UseQueryOptions<GetOrganizationsResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getOrganizations"],
    queryFn: async () => await getOrganizationsService(),
    ...options,
  });
}

export function useGetOrganizationService(
  props: GetOrganizationProps,
  options?: UseQueryOptions<GetOrganizationResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getOrganization", props.slug],
    queryFn: async () => await getOrganizationService(props),
    ...options,
  });
}

export function useCreateOrganizationService(
  options?: UseMutationOptions<
    CreateOrganizationServiceResponse,
    HTTPError<ErrorResponse>,
    CreateOrganizationServiceBody
  >
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["createOrganization"],
    mutationFn: async (body: CreateOrganizationServiceBody) =>
      await createOrganizationService(body),
    onSuccess: (data) => {
      toast.success("Organização criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getOrganizations"] });
      router.push(`org/${data.slug}`);
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useUpdateOrganizationService(
  options?: UseMutationOptions<
    UpdateOrganizationServiceResponse,
    HTTPError<ErrorResponse>,
    UpdateOrganizationServiceBody
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateOrganization"],
    mutationFn: async (body: UpdateOrganizationServiceBody) =>
      await updateOrganizationService(body),
    onSuccess: (data) => {
      toast.success("Organização atualizada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getOrganization", data.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["getOrganizations"],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useFetchExistentSlugService(
  props: FetchExistentSlugServiceProps,
  options?: UseQueryOptions<
    FetchExistentSlugServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["fetchExistentSlug", props.slug],
    queryFn: async () => await fetchExistentSlugService(props),
    ...options,
  });
}
