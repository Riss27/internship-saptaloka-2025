import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductFormPage from "./pages/ProductFormPage";

// Halaman placeholder sederhana untuk menu lain
const PlaceholderPage = ({ title }) => <h1 className="text-4xl font-bold text-white">{title}</h1>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Semua rute di dalam sini akan menggunakan MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* 'index' berarti ini adalah halaman default untuk rute induk '/' */}
          <Route index element={<PlaceholderPage title="Homepage Management" />} />
          <Route path="events" element={<PlaceholderPage title="Events Page" />} />
          <Route path="workshop" element={<PlaceholderPage title="Workshop Page" />} />

          {/* Ini adalah halaman katalog yang sudah kita buat */}
          <Route path="catalogue" element={<DashboardPage />} />
          <Route path="catalogue/add" element={<ProductFormPage />} />
          <Route path="catalogue/edit/:id" element={<ProductFormPage />} />

          <Route path="about" element={<PlaceholderPage title="About Page" />} />
          <Route path="articles" element={<PlaceholderPage title="Articles Page" />} />
          <Route path="gallery" element={<PlaceholderPage title="Gallery Page" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
