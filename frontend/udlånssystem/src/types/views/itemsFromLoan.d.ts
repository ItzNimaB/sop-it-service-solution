interface itemsFromLoan {
  UUID: number;
  Oprettet: string;
  Produkt: string;
  Med_taske: boolean;
  Med_Laas: boolean;
  Stregkode: string;
  loan_id: number;
  Returneret?: string | Date;
}
