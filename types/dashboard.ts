export type OverviewStats = {
  totalCompanies: number;
  pendingCompanyRequests: number;
  totalReports: number;
  totalIssues: number;
};

export type OverviewStatsResponse = {
  statusCode: number;
  data: OverviewStats;
  message: string;
  success: boolean;
};
