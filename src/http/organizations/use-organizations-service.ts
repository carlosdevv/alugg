import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import type { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrganizationService, getOrganizationsService } from ".";
import type { ErrorResponse } from "../types";
import type {
  CreateOrganizationServiceBody,
  CreateOrganizationServiceResponse,
  GetOrganizationsResponse,
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
      setCookie("org", data.slug);
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
