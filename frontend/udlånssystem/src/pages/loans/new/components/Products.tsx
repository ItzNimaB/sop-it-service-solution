import { useTranslation } from "react-i18next";

import Table from "@/components/table";

import { columnsFormatter } from "@/helpers/tableHelpers";

import type { products } from "@prisma";

interface ProductsProps {
  products: products[];
  selectedProducts: products[];
  headers?: string[];
  handleaddProduct: (product: products) => void;
  handleRemoveProduct: (product: products) => void;
}

export default function NewLoanProducts({
  products,
  selectedProducts,
  headers,
  handleaddProduct,
  handleRemoveProduct,
}: ProductsProps) {
  const { t } = useTranslation();

  if (!products) return null;

  const columns = columnsFormatter<products>(headers);
  if (!columns) return null;

  return (
    <div className="tables">
      <div className="splitscreen">
        <Table
          columns={columns}
          data={products}
          onRowClick={handleaddProduct}
          saveSearch={false}
        />
      </div>
      <div className="splitscreen">
        {selectedProducts.length > 0 ? (
          <Table
            columns={columns}
            data={selectedProducts}
            onRowClick={handleRemoveProduct}
            saveSearch={false}
          />
        ) : (
          <div className="center">
            <p>{t("Click to choose products")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
