import React from "react";
import CatalogueListPage from "../CatalogueListPage";

const ProductPage = () => {
  return <CatalogueListPage pageTitle="Manage Products" itemType="product" apiEndpoint="products" categoryOptions={["Parfum", "Aromaterapi"]} />;
};

export default ProductPage;
