export interface Partner {
  idPartner: number;
  name: string;
  address: string;
  idDocument: number;
  documentType: string;
  documentNumber: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  active: Boolean;
  idUserCreation?: number;
  creationDate?: string;
  idUserModification?: number;
  modificationDate?: string;
  totalRecords: number;
  isUser: boolean;
}
