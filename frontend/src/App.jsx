import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./admin/components/MainLayout";

// Halaman Produk
import ProductPage from "./admin/pages/products/ProductPage";
import ProductFormPage from "./admin/pages/products/AddProductPage";

// Halaman About
import AboutPage from "./admin/pages/about/AboutPage";

// Halaman Gallery
import GalleryPage from "./admin/pages/gallery/GalleryPage";
import GalleryFormPage from "./admin/pages/gallery/GalleryFormPage";

// Halaman Ingredients
import IngredientPage from "./admin/pages/ingredients/IngredientPage";
import AddIngredientPage from "./admin/pages/ingredients/AddIngredientPage";

// Halaman Lab Tools
import LabToolPage from "./admin/pages/lab_tools/LabToolPage";
import AddLabToolPage from "./admin/pages/lab_tools/AddLabToolPage";

// Halaman Homepage
import Homepage from "./admin/pages/homepage/Homepage";
import AddLandingHeadingPage from "./admin/pages/homepage/AddLandingHeadingPage";

// Halaman Articles
import ArticlePage from "./admin/pages/articles/ArticlePage";
import AddArticlePage from "./admin/pages/articles/AddArticlePage";

const PlaceholderPage = ({ title }) => <h1 className="text-4xl font-bold text-white">{title}</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="homepage" element={<Homepage />} />
          <Route path="homepage/add" element={<AddLandingHeadingPage />} />
          <Route path="homepage/edit/:id" element={<AddLandingHeadingPage />} />
          <Route path="articles" element={<ArticlePage />} />
          <Route path="articles/add" element={<AddArticlePage />} />
          <Route path="articles/edit/:id" element={<AddArticlePage />} />
          <Route path="workshop" element={<PlaceholderPage title="Workshop" />} />
          <Route path="catalogue/products" element={<ProductPage />} />
          <Route path="catalogue/products/add" element={<ProductFormPage />} />
          <Route path="catalogue/products/edit/:id" element={<ProductFormPage />} />
          <Route path="catalogue/ingredients" element={<IngredientPage />} />
          <Route path="catalogue/ingredients/add" element={<AddIngredientPage />} />
          <Route path="catalogue/ingredients/edit/:id" element={<AddIngredientPage />} />
          <Route path="catalogue/lab-tools" element={<LabToolPage />} />
          <Route path="catalogue/lab-tools/add" element={<AddLabToolPage />} />
          <Route path="catalogue/lab-tools/edit/:id" element={<AddLabToolPage />} /> {/* <-- Route yang hilang ditambahkan */}
          <Route path="about" element={<AboutPage />} />
          <Route path="articles" element={<PlaceholderPage title="Articles" />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="gallery/add" element={<GalleryFormPage />} />
          <Route path="gallery/edit/:id" element={<GalleryFormPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
