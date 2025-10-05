import React from "react";
import CatalogueListPage from "../CatalogueListPage";

const LabToolPage = () => {
  return (
    <CatalogueListPage
      pageTitle="Manage Lab Tools"
      itemType="lab-tool"
      apiEndpoint="lab-tools"
      // Tidak ada kategori, jadi prop-nya tidak dikirim
    />
  );
};

export default LabToolPage;
