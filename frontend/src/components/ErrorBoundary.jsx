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
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Terjadi kesalahan</h1>
          <p className="text-slate-400 mb-6">Halaman gagal dimuat. Coba muat ulang.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
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
