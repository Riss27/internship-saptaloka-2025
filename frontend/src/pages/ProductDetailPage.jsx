import React from "react";
import ItemDetailPage from "../components/features/catalogue/ItemDetailPage";
import { useLanguage } from "../context/useLanguage";

const ProductDetailPage = () => {
  const { t } = useLanguage();
  
  return (
    <ItemDetailPage 
      apiEndpoint="products" 
      breadcrumbName={t('services.products')}
      breadcrumbPath="/products" 
    />
  );
};

export default ProductDetailPage;