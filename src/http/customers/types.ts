import type { Customer } from "@prisma/client";

export type CustomerProps = {
  id: string;
  name: string;
  document: string;
  secondDocument?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  mediaContact?: string;
  additionalInformation?: string;
  createdAt: string;
  updatedAt: string;
  contractId?: string;
  zipcode?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

export type GetCustomersServiceProps = {
  slug: string;
};

export type GetCustomersServiceResponse = {
  data: CustomerProps[];
  total: number;
};

export type CreateCustomerServiceBody = {
  name: string;
  document: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  secondDocument?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  mediaContact?: string;
  additionalInformation?: string;
};

export type CreateCustomerServiceResponse = {
  customer: Customer & {
    address: {
      number: number;
      street: string;
      neighborhood: string;
      city: string;
      state: string;
      zipcode: string;
    };
  };
};

export type DeleteCustomerServiceBody = {
  customerId: string;
};

export type GetCustomerByIdServiceProps = {
  slug: string;
  customerId: string;
};

export type GetCustomerByIdServiceResponse = CustomerProps;

export type UpdateCustomerServiceProps = GetCustomerByIdServiceProps;

export type UpdateCustomerResponse = CustomerProps;

export type UpdateCustomerServiceBody = CreateCustomerServiceBody;
