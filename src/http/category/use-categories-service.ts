import { useModalStore } from "@/hooks/use-modal-store";
import { appRoutes } from "@/lib/constants";
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
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
} from ".";
import type { ErrorResponse } from "../types";
import type {
  CreateCategoryServiceBody,
  CreateCategoryServiceResponse,
  DeleteCategoryServiceBody,
  GetCategoryProps,
  GetCategoryResponse,
  GetCategoriesResponse,
  UpdateCategoryServiceBody,
  UpdateCategoryServiceResponse,
} from "./types";

export function useGetCategoriesService(
  options?: UseQueryOptions<GetCategoriesResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getCategories"],
    queryFn: async () => await getCategoriesService(),
    ...options,
  });
}

export function useGetCategoryService(
  props: GetCategoryProps,
  options?: UseQueryOptions<GetCategoryResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getCategory", props.categoryId],
    queryFn: async () => await getCategoryService(props),
    ...options,
  });
}

export function useCreateCategoryService(
  options?: UseMutationOptions<
    CreateCategoryServiceResponse,
    HTTPError<ErrorResponse>,
    CreateCategoryServiceBody
  >
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["createCategory"],
    mutationFn: async (body: CreateCategoryServiceBody) =>
      await createCategoryService(body),
    onSuccess: (data) => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });

      router.back();
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useUpdateCategoryService(
  options?: UseMutationOptions<
    UpdateCategoryServiceResponse,
    HTTPError<ErrorResponse>,
    UpdateCategoryServiceBody
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: async (body: UpdateCategoryServiceBody) =>
      await updateCategoryService(body),
    onSuccess: (data) => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getCategory", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["getCategories"],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}

export function useDeleteCategoryService(
  options?: UseMutationOptions<
    void,
    HTTPError<ErrorResponse>,
    DeleteCategoryServiceBody
  >
) {
  const router = useRouter();

  return useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: async (body: DeleteCategoryServiceBody) =>
      await deleteCategoryService(body),
    onSuccess: () => {
      toast.success("Categoria deletada com sucesso!");
      router.push(appRoutes.onboarding);
      router.refresh();
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}
