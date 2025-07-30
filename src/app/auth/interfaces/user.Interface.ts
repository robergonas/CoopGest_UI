export interface User {
  idPartner: number;
  userName: string;
  password: string;
  active: boolean;
  token: string;
  hoursTokenLife: number;
  tokenCreationDate: string;
  tokenExpirationDate: string;
  idUserCreation: number;
  creationDate: string;
  idUserModification?: number;
  fullName: string;
  totalRecords: number;
  isAutenticated: boolean;
  email: string;
}
