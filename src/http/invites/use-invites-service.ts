import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  acceptInviteService,
  createInviteService,
  getInvitesService,
  pendingInvitesService,
  rejectInviteService,
  revokeInviteService,
} from ".";
import type { ErrorResponse } from "../types";
import type {
  AcceptInviteServiceBody,
  CreateInviteServiceBody,
  CreateInviteServiceResponse,
  GetInvitesServiceProps,
  GetInvitesServiceResponse,
  PendingInvitesServiceProps,
  PendingInvitesServiceResponse,
  RejectInviteServiceBody,
  RevokeInviteServiceBody,
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

export function useCreateInviteService(
  options?: UseMutationOptions<
    CreateInviteServiceResponse,
    HTTPError<ErrorResponse>,
    CreateInviteServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["createInvite"],
    mutationFn: async (body: CreateInviteServiceBody) =>
      await createInviteService(body),
    onSuccess: () => {
      toast.success("Convite enviado!");
      queryClient.invalidateQueries({
        queryKey: ["getInvites", slug],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useRevokeInviteService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    RevokeInviteServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["revokeInvite"],
    mutationFn: async (body: RevokeInviteServiceBody) =>
      await revokeInviteService(body),
    onSuccess: () => {
      toast.success("Convite cancelado!");
      queryClient.invalidateQueries({
        queryKey: ["getInvites", slug],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function usePendingInvitesService(
  props: PendingInvitesServiceProps,
  options?: UseQueryOptions<
    PendingInvitesServiceResponse[],
    HTTPError<ErrorResponse>
  >
) {
  return useQuery({
    queryKey: ["pendingInvites", props.slug],
    queryFn: async () => await pendingInvitesService(props),
    ...options,
  });
}

export function useAcceptInviteService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    AcceptInviteServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["acceptInvite"],
    mutationFn: async (body: AcceptInviteServiceBody) =>
      await acceptInviteService(body),
    onSuccess: () => {
      toast.success("Convite aceito!");
      queryClient.invalidateQueries({
        queryKey: ["pendingInvites", slug],
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

export function useRejectInviteService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    RejectInviteServiceBody
  >
) {
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["rejectInvite"],
    mutationFn: async (body: RejectInviteServiceBody) =>
      await rejectInviteService(body),
    onSuccess: () => {
      toast.success("Convite recusado!");
      queryClient.invalidateQueries({
        queryKey: ["pendingInvites", slug],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}
