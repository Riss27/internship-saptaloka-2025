import React from "react";
import CatalogueListPage from "../CatalogueListPage";

const LabToolPage = () => {
  return (
    <CatalogueListPage
      pageTitle="Kelola alat lab"
      itemType="alat lab"
      apiEndpoint="lab-tools"
      // Tidak ada kategori, jadi prop-nya tidak dikirim
    />
  );
};

export default LabToolPage;
