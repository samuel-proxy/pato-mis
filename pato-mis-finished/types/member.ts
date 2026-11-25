export interface Member {
  id: string;
  name: string;
  nationalId: string;
  phone: string;
  email: string;
  depositsCents: number;
  savingsCents: number;
  inArrears: boolean;
  idVerified: boolean;
  joined: string;
}

export interface MemberRegistrationInput {
  name: string;
  nationalId: string;
  phone: string;
  email: string;
  idVerified: boolean;
}
