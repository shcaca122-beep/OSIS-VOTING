import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin Panel - E-Voting OSIS",
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Set background utama menjadi abu-abu sangat muda agar dashboard lebih menonjol */}
      <body className="antialiased bg-slate-50 text-slate-900" suppressHydrationWarning>
        
        {/* Container Utama: Flexbox full screen */}
        <div className="flex h-screen overflow-hidden">
          
          {/* ================= SIDEBAR (KIRI) ================= */}
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
            {/* Logo / Judul Aplikasi */}
            <div className="p-6 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                E-Voting <span className="text-slate-800">OSIS</span>
              </h1>
            </div>

            {/* Menu Navigasi */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <Link 
                href="/admin/dashboard" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-semibold transition"
              >
                📊 Dashboard
              </Link>
              
              <Link 
                href="/admin/kandidat" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
              >
                👥 Data Paslon
              </Link>
              
              <Link 
                href="/admin/pemilih" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
              >
                📝 Data Pemilih
              </Link>

              <Link 
                href="/admin/pengaturan" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
              >
                ⚙️ Pengaturan
              </Link>

              <Link 
                href="/admin/kelas" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
              >
                🏫 Data Kelas
              </Link>
            </nav>

            {/* Tombol Logout di Bawah */}
            <div className="p-4 border-t border-slate-200">
              <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                🚪 Logout
              </button>
            </div>
          </aside>


          {/* ================= AREA KONTEN UTAMA (KANAN) ================= */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* TOP NAVBAR */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
              <h2 className="text-lg font-semibold text-slate-700">
                Portal Administrator
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-500">
                  Halo, Panitia
                </span>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  P
                </div>
              </div>
            </header>

            {/* HALAMAN DASHBOARD / KONTEN AKAN MASUK DI SINI */}
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
            
          </div>
        </div>

      </body>
    </html>
  );
}