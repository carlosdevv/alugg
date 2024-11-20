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
