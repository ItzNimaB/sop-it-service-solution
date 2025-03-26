interface productModel extends defaultModel {
  brand_id: brandModel["UUID"];
  category_id: categoryModel["UUID"];
  date_created: string | Date;
  date_updated: string | Date;
  product_id_prefix: string;
  image_name?: string;
}
