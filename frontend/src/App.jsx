import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./admin/components/MainLayout";

// Homepage
import Homepage from "./admin/pages/homepage/Homepage";
import AddLandingHeadingPage from "./admin/pages/homepage/AddLandingHeadingPage";

// Articles
import ArticlePage from "./admin/pages/articles/ArticlePage";
import AddArticlePage from "./admin/pages/articles/AddArticlePage";

// Products
import ProductPage from "./admin/pages/products/ProductPage";
import ProductFormPage from "./admin/pages/products/AddProductPage";

// Ingredients
import IngredientPage from "./admin/pages/ingredients/IngredientPage";
import AddIngredientPage from "./admin/pages/ingredients/AddIngredientPage";

// Lab Tools
import LabToolPage from "./admin/pages/lab_tools/LabToolPage";
import AddLabToolPage from "./admin/pages/lab_tools/AddLabToolPage";

// Gallery
import GalleryPage from "./admin/pages/gallery/GalleryPage";
import GalleryFormPage from "./admin/pages/gallery/GalleryFormPage";

// About
import AboutPage from "./admin/pages/about/AboutPage";

// Events
import EventPage from "./admin/pages/events/EventPage";
import AddEventPage from "./admin/pages/events/AddEventPage";
import RegisteredPeoplePage from "./admin/pages/events/RegisteredPeoplePage";

const PlaceholderPage = ({ title }) => <h1 className="text-4xl font-bold text-white">{title}</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Homepage */}
          <Route index element={<Homepage />} />
          <Route path="homepage" element={<Homepage />} />
          <Route path="homepage/add" element={<AddLandingHeadingPage />} />
          <Route path="homepage/edit/:id" element={<AddLandingHeadingPage />} />

          {/* Articles */}
          <Route path="articles" element={<ArticlePage />} />
          <Route path="articles/add" element={<AddArticlePage />} />
          <Route path="articles/edit/:id" element={<AddArticlePage />} />

          {/* Catalogue - Products */}
          <Route path="catalogue/products" element={<ProductPage />} />
          <Route path="catalogue/products/add" element={<ProductFormPage />} />
          <Route path="catalogue/products/edit/:id" element={<ProductFormPage />} />

          {/* Catalogue - Ingredients */}
          <Route path="catalogue/ingredients" element={<IngredientPage />} />
          <Route path="catalogue/ingredients/add" element={<AddIngredientPage />} />
          <Route path="catalogue/ingredients/edit/:id" element={<AddIngredientPage />} />

          {/* Catalogue - Lab Tools */}
          <Route path="catalogue/lab-tools" element={<LabToolPage />} />
          <Route path="catalogue/lab-tools/add" element={<AddLabToolPage />} />
          <Route path="catalogue/lab-tools/edit/:id" element={<AddLabToolPage />} />

          {/* Gallery */}
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="gallery/add" element={<GalleryFormPage />} />
          <Route path="gallery/edit/:id" element={<GalleryFormPage />} />

          {/* About */}
          <Route path="about" element={<AboutPage />} />

          {/* workshop */}
          <Route path="workshop" element={<PlaceholderPage title="Workshop" />} />

          {/* Events */}
          <Route path="events" element={<EventPage />} />
          <Route path="events/add" element={<AddEventPage />} />
          <Route path="events/edit/:id" element={<AddEventPage />} />
          <Route path="events/registrations/:eventId" element={<RegisteredPeoplePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
