export interface Fee {
  feeNumber: number;
  feeDate: string;
  initialBalance: number;
  rateAmount: number;
  amortization: number;
  feeAmount: number;
  endBalance: number;
  rateValue: number;
  numberOfFee: number;
  interestAmount: number;
  amountToPay: number;
  status: string;
  idLoan: number;
}
