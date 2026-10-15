import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Halaman Auth
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));

// Halaman Publik
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const IngredientsPage = lazy(() => import("./pages/IngredientsPage"));
const IngredientDetailPage = lazy(() => import("./pages/IngredientDetailPage"));
const LabToolsPage = lazy(() => import("./pages/LabToolsPage"));
const LabToolDetailPage = lazy(() => import("./pages/LabToolDetailPage"));
const WorkshopsPage = lazy(() => import("./pages/WorkshopsPage"));
const WorkshopDetailPage = lazy(() => import("./pages/WorkshopDetailPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const ArticleDetailPage = lazy(() => import("./pages/ArticleDetailPage"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));

// Halaman Admin
const Homepage = lazy(() => import("./admin/pages/homepage/Homepage"));
const AddLandingHeadingPage = lazy(() => import("./admin/pages/homepage/AddLandingHeadingPage"));
const ArticlePage = lazy(() => import("./admin/pages/articles/ArticlePage"));
const AddArticlePage = lazy(() => import("./admin/pages/articles/AddArticlePage"));
const ProductPage = lazy(() => import("./admin/pages/products/ProductPage"));
const AddProductPage = lazy(() => import("./admin/pages/products/AddProductPage"));
const IngredientPage = lazy(() => import("./admin/pages/ingredients/IngredientPage"));
const AddIngredientPage = lazy(() => import("./admin/pages/ingredients/AddIngredientPage"));
const LabToolPage = lazy(() => import("./admin/pages/lab_tools/LabToolPage"));
const AddLabToolPage = lazy(() => import("./admin/pages/lab_tools/AddLabToolPage"));
const AdminGalleryPage = lazy(() => import("./admin/pages/gallery/GalleryPage"));
const GalleryFormPage = lazy(() => import("./admin/pages/gallery/GalleryFormPage"));
const AboutPageAdmin = lazy(() => import("./admin/pages/about/AboutPage"));
const EventPage = lazy(() => import("./admin/pages/events/EventPage"));
const AddEventPage = lazy(() => import("./admin/pages/events/AddEventPage"));
const RegisteredPeoplePage = lazy(() => import("./admin/pages/events/RegisteredPeoplePage"));
const WorkshopPage = lazy(() => import("./admin/pages/workshop/WorkshopPage"));
const AddWorkshopPage = lazy(() => import("./admin/pages/workshop/AddWorkshopPage"));

const PageFallback = (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
    Memuat...
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={PageFallback}>
        <Routes>
          {/* Rute Auth */}
          <Route path="/login" element={<LoginPage />} />
          {/* Rute Publik */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="ingredients" element={<IngredientsPage />} />
            <Route path="ingredients/:id" element={<IngredientDetailPage />} />
            <Route path="lab-tools" element={<LabToolsPage />} />
            <Route path="lab-tools/:id" element={<LabToolDetailPage />} />
            <Route path="workshops" element={<WorkshopsPage />} />
            <Route path="workshops/:id" element={<WorkshopDetailPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
            <Route path="pos" element={<ComingSoonPage />} />
          </Route>

          {/* Rute Admin */}
          <Route element={<ProtectedRoute />}>
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
              <Route path="catalogue/products/add" element={<AddProductPage />} />
              <Route path="catalogue/products/edit/:id" element={<AddProductPage />} />

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
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
