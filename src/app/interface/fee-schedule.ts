export interface FeeSchedule {
  idLoan: number;
  feeNumber: number;
  initialBalance: number;
  interestAmount: number;
  amortization: number;
  feeAmount: number;
  amountToPay: number;
  endBalance: number;
  feeDate: string;
  paid: boolean;
  paidDetail: string;
  active: boolean;
  observation: string;
  idUserCreate: number;
  userCreation: string;
  creationDate: string;
  idUserModification: number;
  userModification: string;
  modificationDate: string;
}
