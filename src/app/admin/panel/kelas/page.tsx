"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClassData {
  id: string;
  name: string;
  totalStudents: number;
  createdAt: string;
}

const initialClasses: ClassData[] = [
  {
    id: "uuid-1",
    name: "X.PPLG-1",
    totalStudents: 36,
    createdAt: "2026-06-01",
  },
  {
    id: "uuid-2",
    name: "X.PPLG-2",
    totalStudents: 35,
    createdAt: "2026-06-01",
  },
];

export default function DataKelasPage() {
  const [classes, setClasses] = useState<ClassData[]>(initialClasses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  // Menyaring data kelas berdasarkan input pencarian
  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Aksi menambahkan kelas baru
  const handleAddClass = () => {
    if (!newClassName.trim()) return;

    const newClass: ClassData = {
      id: typeof window !== "undefined" ? crypto.randomUUID() : Math.random().toString(),
      name: newClassName.trim(),
      totalStudents: 0, // Default siswa baru kosong
      createdAt: new Date().toISOString().split("T")[0],
    };

    setClasses([newClass, ...classes]);
    setNewClassName(""); // Reset form input
    setIsOpen(false); // Tutup modal dialog
  };

  // Aksi menghapus kelas
  const handleDeleteClass = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  return (
    <main className="pt-20 md:pt-8 px-4 md:px-8 pb-24 md:pb-8 w-full grow">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Kelas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola master data kelas.
          </p>
        </div>

        {/* Dialog Tambah Kelas */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] shadow-md shadow-blue-500/20">
              <Plus className="w-5 h-5" />
              <span>Tambah Kelas</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <input
                type="text"
                placeholder="Nama Kelas (Contoh: X.PPLG-1)"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddClass()}
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setNewClassName("");
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddClass}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel Data Kelas */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              placeholder="Cari nama kelas..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Nama Kelas</th>
                <th className="px-6 py-4">Siswa</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.totalStudents} Siswa
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Kelas"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Kelas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400">
                    Tidak ada data kelas ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}