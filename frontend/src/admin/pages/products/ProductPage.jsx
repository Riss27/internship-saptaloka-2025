import React from "react";
import CatalogueListPage from "../CatalogueListPage";

const ProductPage = () => {
  return (
    <CatalogueListPage
      pageTitle="Kelola produk"
      itemType="produk"
      apiEndpoint="products"
      categoryOptions={["Parfum", "Aromaterapi"]}
    />
  );
};

export default ProductPage;
