import React from "react";
import CatalogueListPage from "../CatalogueListPage";

const IngredientPage = () => {
  return (
    <CatalogueListPage
      pageTitle="Kelola bahan"
      itemType="bahan"
      apiEndpoint="ingredients"
      categoryOptions={["Essential Oil", "Non Essential Oil"]}
    />
  );
};

export default IngredientPage;
