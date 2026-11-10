interface itemModel {
  UUID: number;
  date_created: string;
  date_updated: string;
  storage_location_id: storageLocationModel["UUID"];
  product_status_id: productStatusModel["UUID"];
  department_id?: departmentModel["UUID"] | null;
  product_id: productModel["UUID"];
  description: string;
  barcode_number: number;
}
