import React from "react";

// Menangkap error runtime saat render (mis. data korup) supaya seluruh aplikasi
// tidak menjadi halaman kosong tanpa keterangan.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary menangkap error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-900 text-cream/80 px-4 py-10 text-center"
        >
          <h1 className="text-2xl font-medium text-cream mb-2 uppercase tracking-wide">
            Terjadi kesalahan
          </h1>
          <p className="text-cream/80 mb-6 max-w-md">
            Halaman gagal dimuat. Coba muat ulang.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-11 px-6 py-2.5 rounded-buttons-pill bg-brand-600 hover:bg-brand-700 text-cream font-medium uppercase tracking-wide text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
          >
            Muat ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
