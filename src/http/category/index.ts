import { api } from "../api-client";
import type {
  CreateCategoryServiceBody,
  CreateCategoryServiceResponse,
  DeleteCategoryServiceBody,
  GetCategoriesProps,
  GetCategoriesResponse,
  GetCategoryApiProps,
  GetCategoryProps,
  GetCategoryResponse,
  UpdateCategoryServiceBody,
  UpdateCategoryServiceResponse,
} from "./types";

export async function getCategoriesService({
  slug,
  page = 1,
  limit = 10,
  categoryName,
}: GetCategoriesProps): Promise<GetCategoriesResponse> {
  const params = new URLSearchParams();

  if (categoryName) {
    params.append("categoryName", categoryName);
  }
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const url = `api/organizations/${slug}/categories?${params.toString()}`;

  const result = await api.get(url).json<GetCategoriesResponse>();
  return result;
}

export async function getCategoryService({
  slug,
  categoryId,
}: GetCategoryProps): Promise<GetCategoryResponse> {
  const result = await api
    .get(`api/organizations/${slug}/categories/${categoryId}`)
    .json<GetCategoryApiProps>();

  return result.category;
}

export async function createCategoryService({
  slug,
  name,
}: CreateCategoryServiceBody): Promise<CreateCategoryServiceResponse> {
  return await api
    .post(`api/organizations/${slug}/categories`, {
      json: {
        name,
      },
    })
    .json<CreateCategoryServiceResponse>();
}

export async function updateCategoryService({
  slug,
  categoryId,
  name,
}: UpdateCategoryServiceBody): Promise<UpdateCategoryServiceResponse> {
  return await api
    .patch(`api/organizations/${slug}/categories/${categoryId}`, {
      json: {
        name,
      },
    })
    .json<UpdateCategoryServiceResponse>();
}

export async function deleteCategoryService({
  slug,
  categoryId,
}: DeleteCategoryServiceBody): Promise<void> {
  await api.delete(`api/organizations/${slug}/categories/${categoryId}`);
}
