import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useParams } from "next/navigation";
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
  GetCategoriesProps,
  GetCategoriesResponse,
  GetCategoryProps,
  GetCategoryResponse,
  UpdateCategoryServiceBody,
  UpdateCategoryServiceResponse,
} from "./types";

export function useGetCategoriesService(
  props: GetCategoriesProps,
  options?: UseQueryOptions<GetCategoriesResponse, HTTPError<ErrorResponse>>
) {
  return useQuery({
    queryKey: ["getCategories", props.slug],
    queryFn: async () => await getCategoriesService(props),
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
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["createCategory"],
    mutationFn: async (body: CreateCategoryServiceBody) =>
      await createCategoryService(body),
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["getCategories", slug] });
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
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: async (body: UpdateCategoryServiceBody) =>
      await updateCategoryService(body),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getCategories", slug],
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
  const queryClient = useQueryClient();
  const { slug } = useParams() as { slug: string };

  return useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: async (body: DeleteCategoryServiceBody) =>
      await deleteCategoryService(body),
    onSuccess: () => {
      toast.success("Categoria deletada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["getCategories", slug],
      });
    },
    onError: async (error) => {
      const { message } = await error.response.json();
      toast.error(message);
    },
    ...options,
  });
}
