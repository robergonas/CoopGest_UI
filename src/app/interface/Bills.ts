export interface Bills {
  idBills: number;
  amount: number;
  period: number;
  concept: string;
  active: boolean;
  idUserCreation: number;
  userCreation: string;
  creationDate: string;
  idUserModification: number;
  userModification: string;
  modificationDate: string;
}
