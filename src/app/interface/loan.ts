export interface Loan {
  idLoan: number;
  idPartner: number;
  partner: string;
  documentType: string;
  documentNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  amount: number;
  idInterestRate: number;
  interestRate: number;
  idFee: number;
  feeCount: number;
  approvedDate: string;
  active: boolean;
  idUserCreation: number;
  userCreation: string;
  creationDate: string;
}
