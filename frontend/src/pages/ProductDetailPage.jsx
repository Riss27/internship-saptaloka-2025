import React from "react";
import ItemDetailPage from "../components/features/catalogue/ItemDetailPage";

const ProductDetailPage = () => {
  return <ItemDetailPage apiEndpoint="products" breadcrumbName="Produk" breadcrumbPath="/products" />;
};

export default ProductDetailPage;
