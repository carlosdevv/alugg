import type { ContractStatus } from "@prisma/client";

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
