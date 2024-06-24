interface itemInLoanModel {
  UUID: number;
  loan_id: loanModel["UUID"];
  item_id: itemModel["UUID"];
  date_created: string | Date;
  date_updated: string | Date;
}
