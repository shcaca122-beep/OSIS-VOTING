"use client";

import { Bell, User } from "lucide-react";

export function AdminTopBar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 w-full">
      {/* Bagian Kiri: Judul Mobile Space */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-700 md:hidden">
          E-Voting Admin
        </span>
      </div>

      {/* Bagian Kanan: Notifikasi & Profil */}
      <div className="flex items-center gap-4">
        {/* Tombol Notifikasi */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Info Profil */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-700 leading-none">
              Administrator
            </span>
            <span className="text-xs text-slate-400 mt-1">Main Auth</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}