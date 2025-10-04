import React from "react";
import CatalogueForm from "../../components/catalogue/CatalogueForm";

const AddIngredientPage = () => {
  return <CatalogueForm itemType="ingredient" apiEndpoint="ingredients" navigateBackUrl="/admin/catalogue/ingredients" categoryOptions={["Essential Oil", "Non Essential Oil"]} />;
};

export default AddIngredientPage;
