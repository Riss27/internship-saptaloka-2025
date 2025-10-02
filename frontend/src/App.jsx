import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";

// Halaman Publik
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import IngredientsPage from "./pages/IngredientsPage";
import LabToolsPage from "./pages/LabToolsPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import EventsPage from "./pages/EventsPage";
import GalleryPage from "./pages/GalleryPage";
import ArticlesPage from "./pages/ArticlesPage";

// Halaman Admin
import Homepage from "./admin/pages/homepage/Homepage";
import AddLandingHeadingPage from "./admin/pages/homepage/AddLandingHeadingPage";
import ArticlePage from "./admin/pages/articles/ArticlePage";
import AddArticlePage from "./admin/pages/articles/AddArticlePage";
import ProductPage from "./admin/pages/products/ProductPage";
import ProductFormPage from "./admin/pages/products/AddProductPage";
import IngredientPage from "./admin/pages/ingredients/IngredientPage";
import AddIngredientPage from "./admin/pages/ingredients/AddIngredientPage";
import LabToolPage from "./admin/pages/lab_tools/LabToolPage";
import AddLabToolPage from "./admin/pages/lab_tools/AddLabToolPage";
import AdminGalleryPage from "./admin/pages/gallery/GalleryPage";
import GalleryFormPage from "./admin/pages/gallery/GalleryFormPage";
import AboutPageAdmin from "./admin/pages/about/AboutPage";
import EventPage from "./admin/pages/events/EventPage";
import AddEventPage from "./admin/pages/events/AddEventPage";
import RegisteredPeoplePage from "./admin/pages/events/RegisteredPeoplePage";
import WorkshopPage from "./admin/pages/workshop/WorkshopPage";
import AddWorkshopPage from "./admin/pages/workshop/AddWorkshopPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="ingredients" element={<IngredientsPage />} />
          <Route path="lab-tools" element={<LabToolsPage />} />
          <Route path="workshops" element={<WorkshopsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="articles" element={<ArticlesPage />} />
        </Route>

        {/* Rute Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Homepage />} />
          <Route path="homepage" element={<Homepage />} />
          <Route path="homepage/add" element={<AddLandingHeadingPage />} />
          <Route path="homepage/edit/:id" element={<AddLandingHeadingPage />} />

          <Route path="events" element={<EventPage />} />
          <Route path="events/add" element={<AddEventPage />} />
          <Route path="events/edit/:id" element={<AddEventPage />} />
          <Route path="events/registrations/:eventId" element={<RegisteredPeoplePage />} />

          <Route path="workshop" element={<WorkshopPage />} />
          <Route path="workshop/add" element={<AddWorkshopPage />} />
          <Route path="workshop/edit/:id" element={<AddWorkshopPage />} />

          <Route path="catalogue/products" element={<ProductPage />} />
          <Route path="catalogue/products/add" element={<ProductFormPage />} />
          <Route path="catalogue/products/edit/:id" element={<ProductFormPage />} />

          <Route path="catalogue/ingredients" element={<IngredientPage />} />
          <Route path="catalogue/ingredients/add" element={<AddIngredientPage />} />
          <Route path="catalogue/ingredients/edit/:id" element={<AddIngredientPage />} />

          <Route path="catalogue/lab-tools" element={<LabToolPage />} />
          <Route path="catalogue/lab-tools/add" element={<AddLabToolPage />} />
          <Route path="catalogue/lab-tools/edit/:id" element={<AddLabToolPage />} />

          <Route path="about" element={<AboutPageAdmin />} />
          <Route path="articles" element={<ArticlePage />} />
          <Route path="articles/add" element={<AddArticlePage />} />
          <Route path="articles/edit/:id" element={<AddArticlePage />} />

          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="gallery/add" element={<GalleryFormPage />} />
          <Route path="gallery/edit/:id" element={<GalleryFormPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
