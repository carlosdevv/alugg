
export type GetCategoriesApiProps = {
  categories: {
    id: string;
    name: string;
    totalItems: number;
    inventoryId: string | null
  }[];
};

export type GetCategoryApiProps = {
  category: {
    id: string;
    name: string;
    totalItems: number;
    inventoryId: string | null;
  };
};

export type GetCategoriesResponse = GetCategoriesApiProps["categories"];

export type GetCategoryProps = {
  categoryId: string;
};

export type GetCategoryResponse = GetCategoryApiProps["category"];

export type CreateCategoryServiceBody = {
  name: string;
  inventoryId?: string;
};

export type CreateCategoryServiceResponse = {
  id: string;
  name: string;
};

export type UpdateCategoryServiceBody = {
  categoryId: string;
  name?: string;
  inventoryId?: string;
};

export type UpdateCategoryServiceResponse = CreateCategoryServiceResponse;

export type DeleteCategoryServiceBody = {
  categoryId: string;
};
