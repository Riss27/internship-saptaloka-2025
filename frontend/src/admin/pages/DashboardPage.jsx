import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  Package,
  Calendar,
  Briefcase,
  Image,
  Users,
  Leaf,
  FlaskConical,
  GalleryHorizontalEnd,
  Plus,
} from "lucide-react";
import apiClient from "../../hooks/apiClient";
import ErrorBanner from "../../components/atoms/feedback/ErrorBanner";
import StatCard from "../components/dashboard/StatCard";
import ListPanel from "../components/dashboard/ListPanel";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await apiClient.get("/api/dashboard/stats");
      setStats(response.data.data);
    } catch (err) {
      console.error("Gagal mengambil data dasbor:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Per-element animation (bukan variant propagation): children mount SETELAH
  // loading flip, dan propagasi variants ke anak yang mount terlambat tidak
  // andal — tiap elemen animasi sendiri, tanpa rantai container.
  const enterAnim = (index = 0) =>
    prefersReducedMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.15 },
        }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.25,
            delay: index * 0.05,
            ease: [0.22, 1, 0.36, 1],
          },
        };

  const counts = stats?.counts;
  const recentRegistrations = stats?.recentRegistrations ?? [];
  const recentArticles = stats?.recentArticles ?? [];

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

  const statCards = [
    { key: "articles", label: "Artikel", icon: <FileText aria-hidden="true" className="h-5 w-5" /> },
    { key: "products", label: "Produk", icon: <Package aria-hidden="true" className="h-5 w-5" /> },
    { key: "events", label: "Event", icon: <Calendar aria-hidden="true" className="h-5 w-5" /> },
    { key: "workshops", label: "Workshop", icon: <Briefcase aria-hidden="true" className="h-5 w-5" /> },
    { key: "gallery", label: "Galeri", icon: <Image aria-hidden="true" className="h-5 w-5" /> },
    { key: "registrations", label: "Pendaftar", icon: <Users aria-hidden="true" className="h-5 w-5" /> },
    { key: "ingredients", label: "Bahan", icon: <Leaf aria-hidden="true" className="h-5 w-5" /> },
    { key: "labTools", label: "Alat laboratorium", icon: <FlaskConical aria-hidden="true" className="h-5 w-5" /> },
    { key: "slides", label: "Slide", icon: <GalleryHorizontalEnd aria-hidden="true" className="h-5 w-5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto" aria-busy={loading}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-cream">Dashboard</h1>
        <p className="mt-1 text-cream/60">
          Ringkasan katalog dan pendaftaran terbaru.
        </p>
      </header>

      {error && (
        <ErrorBanner
          title="Gagal memuat dasbor."
          message="Terjadi kesalahan saat mengambil data. Coba lagi nanti."
          className="mb-6"
        />
      )}

      {error && (
        <div className="mb-6">
          <button
            type="button"
            onClick={fetchStats}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 font-medium text-cream/90 transition-colors hover:border-brand-400 ${FOCUS_RING}`}
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Stats */}
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <h2 className="sr-only">Ringkasan data</h2>
        {loading
          ? Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="h-28 rounded-lg bg-brand-700/40 animate-pulse"
              />
            ))
          : statCards.map((card, index) => (
              <motion.div key={card.key} {...enterAnim(index)}>
                <StatCard
                  icon={card.icon}
                  label={card.label}
                  value={counts ? counts[card.key] ?? 0 : 0}
                  spanLast={index === statCards.length - 1}
                />
              </motion.div>
            ))}
      </section>

      {/* Recent lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loading ? (
          <>
            <div className="rounded-lg border border-border bg-brand-800/50 p-4 sm:p-6">
              <div aria-hidden="true" className="h-5 w-40 rounded bg-brand-700/40 animate-pulse mb-4" />
              <div className="space-y-3">
                <div aria-hidden="true" className="h-5 rounded bg-brand-700/40 animate-pulse" />
                <div aria-hidden="true" className="h-5 rounded bg-brand-700/40 animate-pulse" />
                <div aria-hidden="true" className="h-5 rounded bg-brand-700/40 animate-pulse" />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-brand-800/50 p-4 sm:p-6">
              <div aria-hidden="true" className="h-5 w-40 rounded bg-brand-700/40 animate-pulse mb-4" />
              <div className="space-y-3">
                <div aria-hidden="true" className="h-5 rounded bg-brand-700/40 animate-pulse" />
                <div aria-hidden="true" className="h-5 rounded bg-brand-700/40 animate-pulse" />
                <div aria-hidden="true" className="h-5 rounded bg-brand-700/40 animate-pulse" />
              </div>
            </div>
          </>
        ) : (
          <>
            <motion.div {...enterAnim(0)}>
              <ListPanel
                title="Pendaftar event terbaru"
                emptyMessage="Belum ada pendaftar event."
              >
                {recentRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="py-3 flex items-baseline justify-between gap-3 border-b border-border last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-cream truncate">
                        {reg.name}
                      </p>
                      <p className="text-sm text-cream/70 truncate">
                        Mendaftar di{" "}
                        <span className="font-medium text-cream">
                          {reg.eventTitle}
                        </span>
                      </p>
                      <p className="text-meta text-cream/50 truncate">
                        {reg.email}
                      </p>
                    </div>
                    <span className="text-meta text-cream/50 whitespace-nowrap">
                      {formatDate(reg.createdAt)}
                    </span>
                  </div>
                ))}
              </ListPanel>
            </motion.div>

            <motion.div {...enterAnim(1)}>
              <ListPanel
                title="Artikel terbaru"
                emptyMessage="Belum ada artikel."
              >
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="py-3 flex items-baseline justify-between gap-3 border-b border-border last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-cream truncate">
                        {article.title}
                      </p>
                      <p className="text-sm text-cream/70 truncate">
                        {article.author}
                      </p>
                    </div>
                    <span className="text-meta text-cream/50 whitespace-nowrap">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                ))}
              </ListPanel>
            </motion.div>
          </>
        )}
      </div>

      {/* Quick actions */}
      <section className="mt-8">
        <h2 className="text-subheading text-cream mb-3">Aksi cepat</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/articles/add"
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 font-semibold text-cream transition-colors hover:bg-brand-500 ${FOCUS_RING}`}
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            Tambah artikel
          </Link>
          <Link
            to="/admin/events/add"
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 font-semibold text-cream transition-colors hover:bg-brand-500 ${FOCUS_RING}`}
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            Tambah event
          </Link>
          <Link
            to="/admin/catalogue/products/add"
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 font-medium text-cream/90 transition-colors hover:border-brand-400 ${FOCUS_RING}`}
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            Tambah produk
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
