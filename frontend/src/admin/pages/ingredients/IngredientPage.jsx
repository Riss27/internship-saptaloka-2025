import React from 'react';
import CatalogueListPage from '../CatalogueListPage';

const IngredientPage = () => {
  return (
    <CatalogueListPage
      pageTitle="Manage Ingredients"
      itemType="ingredient"
      apiEndpoint="ingredients"
      categoryOptions={["Essential Oil", "Non Essential Oil"]}
    />
  );
};

export default IngredientPage;