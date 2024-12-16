import type { Status } from "@prisma/client";

export type GetItemServiceProps = {
  slug: string;
};

export type GetItemByIdServiceProps = {
  slug: string;
  itemId: string;
};

export type GetItemsApiResponse = {
  items: ItemProps[];
};

export type GetItemByIdApiResponse = ItemProps;

export type ItemProps = {
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
  status: Status;
  objectPrice: number;
  code: string;
  size: string;
  color: string;
};

export type GetItemsServiceResponse = GetItemsApiResponse["items"];

export type UpdateItemByIdServiceProps = {
  id: string;
  slug: string;
};

export type UpdateItemByIdServiceBody = CreateItemServiceBody;

export type UpdateItemByIdApiResponse = ItemProps;

export type CreateItemServiceBody = {
  name: string;
  categoryId: string;
  rentPrice: number;
  description: string | undefined;
  imageUrl: string | undefined;
  amount: number;
  status: Status;
  objectPrice: number;
  code: string | undefined;
  size: string | undefined;
  color: string | undefined;
};

export type CreateItemServiceResponse = ItemProps;

export type DeleteItemServiceProps = GetItemByIdServiceProps;
