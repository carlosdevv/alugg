import type { ItemStatus } from "@prisma/client";

export type GetItemServiceProps = {
  slug: string;
  page?: number;
  limit?: number;
  itemName?: string;
  status?: string[];
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
  status: ItemStatus;
  objectPrice: number;
  code: string;
  size: string;
  color: string;
};

export type GetItemsServiceResponse = {
  items: ItemProps[];
  total: number;
  counts: {
    active: number;
    inactive: number;
  };
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
};

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
  status: ItemStatus;
  objectPrice: number;
  code: string | undefined;
  size: string | undefined;
  color: string | undefined;
};

export type CreateItemServiceResponse = ItemProps;

export type DeleteItemServiceProps = GetItemByIdServiceProps;

export type Item = {
  id: string;
  name: string;
  code: string | null;
  objectPrice: number;
  rentPrice: number;
  size: string | null;
  color: string | null;
  description: string | null;
  amount: number;
  status: ItemStatus;
  imageUrl: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  category: {
    name: string;
  };
};

export type ItemReservation = {
  eventDate: Date;
  withdrawalDate: Date;
  returnDate: Date;
};

export type ItemAvailability = Item & {
  availableQuantity: number;
  isAvailable: boolean;
  reservations: ItemReservation[] | null;
};

export type GetItemsAvailabilityServiceProps = {
  slug: string;
  eventDate: string;
  withdrawalDate: string;
  returnDate: string;
};

export type GetItemsAvailabilityServiceResponse = {
  data: ItemAvailability[];
};

export type ItemHistoryContract = {
  contractId: string;
  code: string;
  customerName: string;
  eventDate: Date;
  withdrawalDate: Date;
  returnDate: Date;
  totalValue: number;
  quantity: number;
};

export type ItemHistoryData = {
  item: {
    id: string;
    name: string;
    amount: number;
  };
  contractHistory: ItemHistoryContract[];
};

export type GetItemHistoryServiceProps = {
  slug: string;
  itemId: string;
};

export type GetItemHistoryServiceResponse = {
  data: ItemHistoryData;
};
