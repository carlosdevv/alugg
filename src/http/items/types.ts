export type GetItemProps = {
  slug: string;
};

export type GetItemByIdProps = {
  slug: string;
  itemId: string;
};

export type GetItemsApiResponse = {
  items: Item[];
};

export type GetItemByIdApiResponse = Item;

export type Item = {
  id: string;
  name: string;
  description: string;
  slug: string;
  category: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  organizationId: string;
  rentPrice: number;
  imageUrl: string;
  amount: number;
  status: string;
  itemInRenovation: boolean;
  objectPrice: number;
};

export type GetItemsResponse = GetItemsApiResponse["items"];

export type UpdateItemByIdProps = {
  id: string;
  slug: string;
  updatedItem: Partial<Item>;
};

export type UpdateItemByIdApiResponse = Item;

export type CreateItemProps = {
  slug: string;
  itemToCreate: CreateItemBody;
};

export type CreateItemBody = {
  name: string;
  categoryId: string;
  rentPrice: number;
  description: string | undefined;
  imageUrl: string | undefined;
  amount: number;
  status: string;
  itemInRenovation: boolean;
  objectPrice: number;
  code: string | undefined;
  size: string | undefined;
  color: string | undefined;
};

export type DeleteItemProps = GetItemByIdProps;
