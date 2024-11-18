import { api } from "../api-client";
import type {
  CreateCategoryServiceBody,
  CreateCategoryServiceResponse,
  DeleteCategoryServiceBody,
  GetCategoryProps,
  GetCategoryApiProps,
  GetCategoriesApiProps,
  GetCategoriesResponse,
  GetCategoryResponse,
  UpdateCategoryServiceBody,
  UpdateCategoryServiceResponse,
} from "./types";

export async function getCategoriesService(): Promise<GetCategoriesResponse> {
  const result = await api
    .get("api/category")
    .json<GetCategoriesApiProps>();

  return result.categories;
}

export async function getCategoryService({
  categoryId,
}: GetCategoryProps): Promise<GetCategoryResponse> {
  const result = await api
    .get(`api/category/${categoryId}`)
    .json<GetCategoryApiProps>();

  return result.category;
}

export async function createCategoryService({
  name,
  inventoryId,
}: CreateCategoryServiceBody): Promise<CreateCategoryServiceResponse> {
  return await api
    .post("api/category", {
      json: {
        name,
        inventoryId,
      },
    })
    .json<CreateCategoryServiceResponse>();
}

export async function updateCategoryService({
  name,
  inventoryId,
  items,
  categoryId
}: UpdateCategoryServiceBody): Promise<UpdateCategoryServiceResponse> {
  return await api
    .patch(`api/category/${categoryId}`, {
      json: {
        name,
        inventoryId,
        items
      },
    })
    .json<UpdateCategoryServiceResponse>();
}


export async function deleteCategoryService({
  categoryId,
}: DeleteCategoryServiceBody): Promise<void> {
  await api.delete(`api/category/${categoryId}`);
}
