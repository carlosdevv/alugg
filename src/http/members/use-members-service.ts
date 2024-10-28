import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { toast } from "sonner";
import { getMembersService, updateMemberRoleService } from ".";
import type { ErrorResponse } from "../types";
import type {
  GetMembersServiceProps,
  GetMembersServiceResponse,
  UpdateMemberRoleServiceBody,
} from "./types";

export function useGetMembersService(
  props: GetMembersServiceProps,
  options?: UseQueryOptions<GetMembersServiceResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getMembers"],
    queryFn: async () => await getMembersService(props),
    ...options,
  });
}

export function useUpdateMemberRoleService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    UpdateMemberRoleServiceBody
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateMemberRole"],
    mutationFn: async (body: UpdateMemberRoleServiceBody) =>
      await updateMemberRoleService(body),
    onSuccess: () => {
      toast.success("Membro atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getMembers"],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}
