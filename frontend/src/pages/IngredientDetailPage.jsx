import React from "react";
import ItemDetailPage from "../components/features/catalogue/ItemDetailPage";

const IngredientDetailPage = () => {
  return <ItemDetailPage apiEndpoint="ingredients" breadcrumbName="Bahan" breadcrumbPath="/ingredients" />;
};

export default IngredientDetailPage;
