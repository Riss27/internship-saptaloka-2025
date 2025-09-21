import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./admin/components/MainLayout";
import ParfumPage from "./admin/pages/ParfumPage";
import ProductFormPage from "./admin/pages/AddProductPage";
import AboutPage from "./admin/pages/AboutPage";
import GalleryPage from "./admin/pages/GalleryPage";
import GalleryFormPage from "./admin/pages/GalleryFormPage";


const PlaceholderPage = ({ title }) => <h1 className="text-4xl font-bold text-white">{title}</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PlaceholderPage title="Homepage" />} />
          <Route path="events" element={<PlaceholderPage title="Events" />} />
          <Route path="workshop" element={<PlaceholderPage title="Workshop" />} />

          <Route path="catalogue/products" element={<ParfumPage />} />
          <Route path="catalogue/products/add" element={<ProductFormPage />} />
          <Route path="catalogue/products/edit/:id" element={<ProductFormPage />} />

          {/* Placeholder untuk 2 sub-menu lainnya */}
          <Route path="catalogue/bahan-baku" element={<PlaceholderPage title="Bahan Baku Management" />} />
          <Route path="catalogue/assets" element={<PlaceholderPage title="Assets Management" />} />

          <Route path="about" element={<AboutPage />} />
          <Route path="articles" element={<PlaceholderPage title="Articles" />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="gallery/add" element={<GalleryFormPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
