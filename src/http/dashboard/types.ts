export type DashboardStatsServiceResponse = {
  finishedContracts: number;
  totalContracts: number;
  totalItems: number;
  clients: number;
  stockItems: number;
};

export type UseGetDashboardStatsServiceProps = {
  slug: string;
};
