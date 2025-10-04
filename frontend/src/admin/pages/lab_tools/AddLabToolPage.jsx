import React from "react";
import CatalogueForm from "../../components/catalogue/CatalogueForm";

const AddLabToolPage = () => {
  // Tidak ada categoryOptions, jadi prop-nya tidak kita kirim
  return <CatalogueForm itemType="lab tool" apiEndpoint="lab-tools" navigateBackUrl="/admin/catalogue/lab-tools" />;
};

export default AddLabToolPage;
