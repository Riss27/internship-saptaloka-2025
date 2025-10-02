import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Carousel from "../components/features/homepage/Carousel";
import ProductCard from "../components/features/products/ProductCard";
import ArticleCard from "../components/features/articles/ArticleCard";
import { FiFeather, FiBox, FiDroplet, FiBookOpen, FiLayers } from "react-icons/fi";
import ServiceCard from "../components/features/homepage/ServiceCard";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const [productsRes, eventsRes, articlesRes, galleryRes] = await Promise.all([
          axios.get("http://localhost:3000/api/products"),
          axios.get("http://localhost:3000/api/events"),
          axios.get("http://localhost:3000/api/articles"),
          axios.get("http://localhost:3000/api/gallery"),
        ]);

        setFeaturedProducts(productsRes.data.data.slice(0, 4));
        setLatestEvents(eventsRes.data.data.slice(0, 3));
        setLatestArticles(articlesRes.data.data.slice(0, 3));
        setGalleryImages(galleryRes.data.data);
      } catch (error) {
        console.error("Gagal mengambil data homepage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-emerald-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Carousel />

      <div className="container mx-auto px-4 py-16 md:py-24 space-y-24">
        {/* Layanan Kami */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-2">Layanan Kami</h2>
          <p className="text-center text-gray-600 mb-12">Dari workshop hingga pembuatan parfum personal, kami siap melayani.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard icon={<FiFeather size={28} className="text-emerald-700" />} title="Workshop Aromaterapi" description="Pelajari seni meracik parfum dengan panduan ahli." linkTo="/workshop/aromaterapi" />
            <ServiceCard icon={<FiBookOpen size={28} className="text-emerald-700" />} title="Workshop Parfum" description="Belajar meracik parfum personal dengan mudah." linkTo="/workshop/parfum" />
            <ServiceCard icon={<FiLayers size={28} className="text-emerald-700" />} title="Buat Parfum Sendiri" description="Kreasikan aroma unikmu dengan panduan kami." linkTo="/" />
            <ServiceCard icon={<FiBox size={28} className="text-emerald-700" />} title="Produk Parfum & Aromaterapi" description="Temukan koleksi parfum unik kami." linkTo="/products" />
            <ServiceCard icon={<FiDroplet size={28} className="text-emerald-700" />} title="Alat Laboratorium Skala Mikro" description="Peralatan lab skala mikro standar industri." linkTo="/lab-tools" />
            <ServiceCard icon={<FiDroplet size={28} className="text-emerald-700" />} title="Bahan Parfum & Aromaterapi" description="Jelajahi bahan baku pilihan kami." linkTo="/ingredients" />
          </div>
        </section>

        {/* Kegiatan Terbaru */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12">Kegiatan Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group border border-gray-200">
                <Link to={`/events/${event.id}`}>
                  <img src={`http://localhost:3000${event.imageBannerUrl}`} alt={`Banner kegiatan ${event.title}`} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" loading="lazy" />
                  <div className="p-4">
                    <p className="text-sm text-emerald-700 font-medium">
                      {new Date(event.startDateTime).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-bold text-lg text-gray-700 mt-1 truncate">{event.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Produk Unggulan */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12">Produk Unggulan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Artikel Terbaru */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12">Artikel Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Galeri Kegiatan */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12">Galeri Kegiatan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.slice(0, 6).map((image) => {
              // Untuk debugging, kita bisa lihat URL gambarnya di console
              console.log("URL Gambar Galeri:", `http://localhost:3000${image.imageUrl}`);

              return (
                <div key={image.id} className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-emerald-50 hover:bg-emerald-50/80 transition-colors">
                  <img src={`http://localhost:3000${image.imageUrl}`} alt={image.title || "Foto kegiatan"} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" loading="lazy" />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
