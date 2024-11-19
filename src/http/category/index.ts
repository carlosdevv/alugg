import { api } from "../api-client";
import type {
  CreateCategoryServiceBody,
  CreateCategoryServiceResponse,
  DeleteCategoryServiceBody,
  GetCategoriesApiProps,
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
}: GetCategoriesProps): Promise<GetCategoriesResponse> {
  const result = await api
    .get(`api/organizations/${slug}/categories`)
    .json<GetCategoriesApiProps>();

  return result.categories;
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
