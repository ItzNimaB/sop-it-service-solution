import Table from "@components/table";

import { columnsFormatter } from "@helpers/tableHelpers";

interface ProductsProps {
  products: productModel[];
  selectedProducts: productModel[];
  headers?: string[];
  handleaddProduct: (product: productModel) => void;
  handleRemoveProduct: (product: productModel) => void;
}

export default function NewLoanProducts({
  products,
  selectedProducts,
  headers,
  handleaddProduct,
  handleRemoveProduct,
}: ProductsProps) {
  if (!products) return null;

  const columns = columnsFormatter<productModel>(headers);
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
          />
        ) : (
          <div className="center">
            <p>Tryk for at tilføje produkter</p>
          </div>
        )}
      </div>
    </div>
  );
}
