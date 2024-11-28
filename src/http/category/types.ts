export type GetCategoriesApiProps = {
  categories: {
    id: string;
    name: string;
    totalItems: number;
  }[];
};

export type GetCategoryApiProps = {
  category: {
    id: string;
    name: string;
    totalItems: number;
  };
};

export type GetCategoriesProps = {
  slug: string;
};

export type GetCategoriesResponse = GetCategoriesApiProps["categories"];

export type GetCategoryProps = {
  slug: string;
  categoryId: string;
};

export type GetCategoryResponse = GetCategoryApiProps["category"];

export type CreateCategoryServiceBody = {
  slug: string;
  name: string;
};

export type CreateCategoryServiceResponse = {
  id: string;
  name: string;
};

export type UpdateCategoryServiceBody = {
  slug: string;
  categoryId: string;
  name?: string;
};

export type UpdateCategoryServiceResponse = CreateCategoryServiceResponse;

export type DeleteCategoryServiceBody = {
  slug: string;
  categoryId: string;
};

export type CategoryModel = { id: string; name: string; totalItems: number };
