export type CustomerProps = {
  id: string;
  name: string;
  document: string;
  secondDocument?: string;
  email?: string;
  phone?: string;
  addressId?: string;
  birthdate?: string;
  mediaContact?: string;
  additionalInformation?: string;
  createdAt: string;
  updatedAt: string;
  contractId?: string;
};

export type GetCustomersServiceProps = {
  slug: string;
};

export type GetCustomersServiceResponse = {
  data: CustomerProps[];
  total: number;
};
