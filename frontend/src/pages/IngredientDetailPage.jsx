import React from "react";
import ItemDetailPage from "../components/features/catalogue/ItemDetailPage";
import { useLanguage } from "../context/useLanguage";

const IngredientDetailPage = () => {
  const { t } = useLanguage();
  
  return (
    <ItemDetailPage 
      apiEndpoint="ingredients" 
      breadcrumbName={t('services.ingredients')}
      breadcrumbPath="/ingredients" 
    />
  );
};

export default IngredientDetailPage;