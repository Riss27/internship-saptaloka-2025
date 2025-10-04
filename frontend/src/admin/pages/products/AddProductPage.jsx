import React from "react";
import CatalogueForm from "../../components/catalogue/CatalogueForm";

const AddProductPage = () => {
  return <CatalogueForm itemType="product" apiEndpoint="products" navigateBackUrl="/admin/catalogue/products" categoryOptions={["Parfum", "Aromaterapi"]} />;
};

export default AddProductPage;
