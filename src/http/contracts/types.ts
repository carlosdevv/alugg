import type { ContractStatus, PaymentMethod } from "@prisma/client";

export type GetContractsServiceProps = {
  slug: string;
  status?: ContractStatus[];
};

export type GetContractsServiceResponse = {
  data: {
    id: string;
    code: number;
    customer: {
      name: string;
      phone: string;
    };
    eventDate: Date;
    withdrawalDate: Date;
    returnDate: Date;
    status: ContractStatus;
    createdAt: Date;
    totalValue: number;
    pendingDebt: number;
    contractDocuments: {
      url: string;
      type: string;
    }[];
  }[];
  count: {
    total: number;
    open: number;
    closed: number;
    cancelled: number;
    collected: number;
  };
};

export type CreateContractServiceBody = {
  totalValue: number;
  customerId: string;
  eventDate: string;
  withdrawalDate: string;
  returnDate: string;
  memberId: string;
  additionalInformation?: string;
  contractUrl: string;
  code?: number;
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

export type GetNextContractCodeServiceProps = {
  slug: string;
};

export type GetNextContractCodeServiceResponse = {
  data: {
    nextCode: number;
  };
};

export type GetContractByIdServiceProps = {
  contractId: string;
  slug: string;
};

export type GetContractByIdServiceResponse = {
  data: {
    id: string;
    code: number;
  };
};
