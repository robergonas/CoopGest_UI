export interface PartnerSummary {
  idPartner: number;
  name: string;
  totalCapital: number;
  totalUtility: number;
  netAmount: number;
  periods: {
    month: string;
    periodCapital: number;
    periodUtility: number;
    periodBill: number;
    partnerPercentage: number;
    partnerCapital: number;
    partnerUtility: number;
    totalPeriod: number;
  }[];
}
