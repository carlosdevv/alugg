import type {
  ContractDocumentType,
  ContractStatus,
  PaymentMethod,
} from "@prisma/client";

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
  data: ContractProps;
};

export type ContractProps = {
  id: string;
  code: number;
  eventDate: Date;
  withdrawalDate: Date;
  returnDate: Date;
  totalValue: number;
  status: ContractStatus;
  additionalInformation?: string | null;
  customer: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
  };
  seller: {
    name: string | null;
    role: string;
  };
  payments: {
    id: string;
    method: PaymentMethod;
    value: number;
    creditParcelAmount: number;
    paymentDate: Date;
    isPaid: boolean;
  }[];
  rentedItems: {
    id: string;
    itemId: string;
    quantity: number;
    isBonus: boolean;
    discount: number | null;
    finalValue: number;
    item: {
      name: string;
      price: number;
      code: string;
    };
  }[];
  contractDocuments: {
    id: string;
    url: string;
    type: ContractDocumentType;
  }[];
  pendingDebt?: number;
};

export type UpdateContractServiceBody = {
  contractId: string;
  eventDate: string;
  withdrawalDate: string;
  returnDate: string;
  additionalInformation?: string | null;
  customerId?: string;
  memberId?: string;
  totalValue?: number;
  payments: {
    id?: string;
    method: PaymentMethod;
    value: number;
    creditParcelAmount: number;
    paymentDate: string;
    isPaid: boolean;
  }[];
  items?: {
    id?: string;
    itemId: string;
    quantity: number;
    isBonus: boolean;
    discount: number;
    finalValue: number;
  }[];
  contractUrl?: string;
};

export type UpdateContractServiceResponse = {
  data: {
    id: string;
    code: number;
  };
};

export type WithdrawalContractServiceBody = {
  pdfUrl: string;
  contractId: string;
};

export type WithdrawalContractServiceResponse = {
  data: {
    pdfUrl: string;
    documentId: string;
  };
};

export type ReturnContractServiceBody = {
  contractId: string;
  pdfUrl: string;
};

export type ReturnContractServiceResponse = {
  data: {
    pdfUrl: string;
    documentId: string;
  };
};

export type GetContractSettingsServiceResponse = {
  data: {
    daysBefore: number;
    daysAfter: number;
  };
};

export type UpdateContractSettingsServiceBody = {
  daysBefore: number;
  daysAfter: number;
};

export type UpdateContractSettingsServiceResponse = {
  data: {
    daysBefore: number;
    daysAfter: number;
  };
};
