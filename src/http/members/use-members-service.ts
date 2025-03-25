import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteMemberService,
  getMemberByIdService,
  getMembersService,
  transferOwnershipService,
  updateMemberRoleService,
} from ".";
import type { ErrorResponse } from "../types";
import type {
  DeleteMemberServiceBody,
  GetMemberByIdServiceProps,
  GetMemberByIdServiceResponse,
  GetMembersServiceProps,
  GetMembersServiceResponse,
  TransferOwnershipServiceBody,
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

export function useGetMemberByIdService(
  props: GetMemberByIdServiceProps,
  options?: UseQueryOptions<
    GetMemberByIdServiceResponse,
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["getMemberById", props.memberId],
    queryFn: async () => await getMemberByIdService(props),
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

export function useTransferOwnershipService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    TransferOwnershipServiceBody
  >
) {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["transferOwnership"],
    mutationFn: async (body: TransferOwnershipServiceBody) =>
      await transferOwnershipService(body),
    onSuccess: () => {
      toast.success("Organização transferida com sucesso!");
      router.push(`/${slug}`);
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useDeleteMemberService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    DeleteMemberServiceBody
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteMember"],
    mutationFn: async (body: DeleteMemberServiceBody) =>
      await deleteMemberService(body),
    onSuccess: () => {
      toast.success("Membro deletado com sucesso!");
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
