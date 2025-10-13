import React from "react";
import ItemDetailPage from "../components/features/catalogue/ItemDetailPage";
import { useLanguage } from "../context/useLanguage";

const LabToolDetailPage = () => {
  const { t } = useLanguage();
  
  return (
    <ItemDetailPage 
      apiEndpoint="lab-tools" 
      breadcrumbName={t('services.lab_tools')}
      breadcrumbPath="/lab-tools" 
    />
  );
};

export default LabToolDetailPage;