import type { ContractStatus, PaymentMethod } from "@prisma/client";

export type GetContractsServiceProps = {
  slug: string;
};

export type GetContractsServiceResponse = {
  data: {
    id: string;
    code: number;
    name: string;
    userId: string;
    status: ContractStatus;
    eventDate: Date;
    startDate: Date;
    endDate: Date;
    totalValue: number;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    organizationId: string | null;
  }[];
  total: number;
};

export type CreateContractServiceBody = {
  totalValue: number;
  customerId: string;
  eventDate: string;
  withdrawalDate: string;
  returnDate: string;
  memberId: string;
  additionalInformation?: string;
  items: {
    itemId: string;
    quantity: number;
    isBonus: boolean;
    discount: number;
    finalValue: number;
  }[];
  paymentMethod: {
    method: PaymentMethod;
    value: number;
    creditParcelAmount: number;
    paymentDate: string;
    isPaid: boolean;
  }[];
};

export type CreateContractServiceResponse = {
  data: {
    id: string;
    code: number;
  };
};
