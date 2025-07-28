import {
  brands,
  buildings,
  categories,
  items,
  items_in_loan,
  loans,
  products,
  product_status,
  users,
  zones,
} from "@prisma";

declare global {
  type FieldType =
    | brands
    | buildings
    | categories
    | items
    | items_in_loan
    | loans
    | products
    | product_status
    | users
    | zones;
}

export { }