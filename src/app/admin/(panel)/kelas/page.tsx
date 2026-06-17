"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
  grade: number;
  voterCount: number;
  createdAt: string;
}

// Master data kelas terbaru sesuai pembagian jurusan (Total 43 Kelas) sebagai Fallback jika DB Kosong
const initialClasses: ClassData[] = [
  // === JURUSAN RPL / PPLG ===
  { id: "c-rpl10-1", name: "X.PPLG-1", grade: 10, voterCount: 36, createdAt: "2026-06-01" },
  { id: "c-rpl10-2", name: "X.PPLG-2", grade: 10, voterCount: 35, createdAt: "2026-06-01" },
  { id: "c-rpl10-3", name: "X.PPLG-3", grade: 10, voterCount: 36, createdAt: "2026-06-01" },
  { id: "c-rpl10-4", name: "X.PPLG-4", grade: 10, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-rpl11-1", name: "XI.PPLG-1", grade: 11, voterCount: 35, createdAt: "2026-06-01" },
  { id: "c-rpl11-2", name: "XI.PPLG-2", grade: 11, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-rpl11-3", name: "XI.PPLG-3", grade: 11, voterCount: 35, createdAt: "2026-06-01" },
  { id: "c-rpl11-4", name: "XI.PPLG-4", grade: 11, voterCount: 36, createdAt: "2026-06-01" },
  { id: "c-rpl12-1", name: "XII.RPL-1", grade: 12, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-rpl12-2", name: "XII.RPL-2", grade: 12, voterCount: 33, createdAt: "2026-06-01" },
  { id: "c-rpl12-3", name: "XII.RPL-3", grade: 12, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-rpl12-4", name: "XII.RPL-4", grade: 12, voterCount: 35, createdAt: "2026-06-01" },

  // === JURUSAN DKV ===
  { id: "c-dkv10-1", name: "X.DKV-1", grade: 10, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-dkv10-2", name: "X.DKV-2", grade: 10, voterCount: 33, createdAt: "2026-06-01" },
  { id: "c-dkv10-3", name: "X.DKV-3", grade: 10, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-dkv10-4", name: "X.DKV-4", grade: 10, voterCount: 32, createdAt: "2026-06-01" },
  { id: "c-dkv11-1", name: "XI.DKV-1", grade: 11, voterCount: 36, createdAt: "2026-06-01" },
  { id: "c-dkv11-2", name: "XI.DKV-2", grade: 11, voterCount: 35, createdAt: "2026-06-01" },
  { id: "c-dkv11-3", name: "XI.DKV-3", grade: 11, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-dkv11-4", name: "XI.DKV-4", grade: 11, voterCount: 36, createdAt: "2026-06-01" },
  { id: "c-dkv12-1", name: "XII.DKV-1", grade: 12, voterCount: 35, createdAt: "2026-06-01" },
  { id: "c-dkv12-2", name: "XII.DKV-2", grade: 12, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-dkv12-3", name: "XII.DKV-3", grade: 12, voterCount: 35, createdAt: "2026-06-01" },
  { id: "c-dkv12-4", name: "XII.DKV-4", grade: 12, voterCount: 33, createdAt: "2026-06-01" },

  // === JURUSAN BRP ===
  { id: "c-brp10-1", name: "X.BRP-1", grade: 10, voterCount: 32, createdAt: "2026-06-01" },
  { id: "c-brp10-2", name: "X.BRP-2", grade: 10, voterCount: 33, createdAt: "2026-06-01" },
  { id: "c-brp10-3", name: "X.BRP-3", grade: 10, voterCount: 31, createdAt: "2026-06-01" },
  { id: "c-brp10-4", name: "X.BRP-4", grade: 10, voterCount: 32, createdAt: "2026-06-01" },
  { id: "c-brp10-5", name: "X.BRP-5", grade: 10, voterCount: 33, createdAt: "2026-06-01" },
  { id: "c-brp10-6", name: "X.BRP-6", grade: 10, voterCount: 31, createdAt: "2026-06-01" },
  { id: "c-brp10-7", name: "X.BRP-7", grade: 10, voterCount: 32, createdAt: "2026-06-01" },
  { id: "c-brp11-1", name: "XI.BRP-1", grade: 11, voterCount: 33, createdAt: "2026-06-01" },
  { id: "c-brp11-2", name: "XI.BRP-2", grade: 11, voterCount: 32, createdAt: "2026-06-01" },
  { id: "c-brp11-3", name: "XI.BRP-3", grade: 11, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-brp11-4", name: "XI.BRP-4", grade: 11, voterCount: 33, createdAt: "2026-06-01" },
  { id: "c-brp11-5", name: "XI.BRP-5", grade: 11, voterCount: 32, createdAt: "2026-06-01" },
  { id: "c-brp11-6", name: "XI.BRP-6", grade: 11, voterCount: 34, createdAt: "2026-06-01" },
  { id: "c-brp12-1", name: "XII.BRP-1", grade: 12, voterCount: 32, createdAt: "2026-06-01" },
  { id: "c-brp12-2", name: "XII.BRP-2", grade: 12, voterCount: 33, createdAt: "2026-06-01" },
  { id: "c-brp12-3", name: "XII.BRP-3", grade: 12, voterCount: 31, createdAt: "2026-06-01" },
  { id: "c-brp12-4", name: "XII.BRP-4", grade: 12, voterCount: 32, createdAt: "2026-06-01" },
  { id: "c-brp12-5", name: "XII.BRP-5", grade: 12, voterCount: 33, createdAt: "2026-06-01" },
  { id: "c-brp12-6", name: "XII.BRP-6", grade: 12, voterCount: 31, createdAt: "2026-06-01" },
];

export default function DataKelasPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // State Tambah Kelas
  const [isOpen, setIsOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  // State Edit Kelas
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editClassName, setEditClassName] = useState("");

  // Fungsi pembantu untuk menebak tingkatan kelas (grade) dari teks nama
  const determineGrade = (className: string): number => {
    const lower = className.toLowerCase();
    if (lower.startsWith("xii")) return 12;
    if (lower.startsWith("xi")) return 11;
    if (lower.startsWith("x")) return 10;
    return 10; // default
  };

  // 1. AMBIL DATA DARI SUPABASE (READ)
  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Mapping field asli DB sesuai gambar ke aplikasi Anda
        const mappedClasses: ClassData[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          grade: item.grade ?? 10,
          voterCount: item.voter_count ?? 0,
          createdAt: item.created_at,
        }));
        setClasses(mappedClasses);
      } else {
        setClasses(initialClasses);
      }
    } catch (err) {
      console.error("Gagal terhubung, menggunakan data fallback lokal.", err);
      setClasses(initialClasses);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. FUNGSI TAMBAH KELAS (CREATE)
  const handleAddClass = async () => {
    if (!newClassName.trim()) return;

    const targetName = newClassName.trim();
    const detectedGrade = determineGrade(targetName);

    const { data, error } = await supabase
      .from("classes")
      .insert([
        {
          name: targetName,
          grade: detectedGrade,
          voter_count: 0,
        },
      ])
      .select();

    if (error) {
      alert("Gagal menambahkan kelas ke Supabase: " + error.message);
    } else if (data && data[0]) {
      const createdItem: ClassData = {
        id: data[0].id,
        name: data[0].name,
        grade: data[0].grade,
        voterCount: data[0].voter_count,
        createdAt: data[0].created_at,
      };
      setClasses([createdItem, ...classes]);
      setNewClassName("");
      setIsOpen(false);
    }
  };

  const handleOpenEdit = (classItem: ClassData) => {
    setEditingClassId(classItem.id);
    setEditClassName(classItem.name);
    setIsEditOpen(true);
  };

  // 3. FUNGSI EDIT KELAS (UPDATE)
  const handleSaveEdit = async () => {
    if (!editClassName.trim() || !editingClassId) return;

    const targetName = editClassName.trim();
    const detectedGrade = determineGrade(targetName);

    // Jika id berawalan dummy "c-", langsung update di UI lokal saja
    if (editingClassId.startsWith("c-")) {
      setClasses(
        classes.map((c) =>
          c.id === editingClassId ? { ...c, name: targetName, grade: detectedGrade } : c
        )
      );
      setIsEditOpen(false);
      setEditingClassId(null);
      setEditClassName("");
      return;
    }

    const { error } = await supabase
      .from("classes")
      .update({ name: targetName, grade: detectedGrade })
      .eq("id", editingClassId);

    if (error) {
      alert("Gagal memperbarui data kelas di Supabase: " + error.message);
    } else {
      setClasses(
        classes.map((c) =>
          c.id === editingClassId ? { ...c, name: targetName, grade: detectedGrade } : c
        )
      );
      setIsEditOpen(false);
      setEditingClassId(null);
      setEditClassName("");
    }
  };

  // 4. FUNGSI HAPUS KELAS (DELETE)
  const handleDeleteClass = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      if (id.startsWith("c-")) {
        setClasses(classes.filter((c) => c.id !== id));
        return;
      }

      const { error } = await supabase.from("classes").delete().eq("id", id);

      if (error) {
        alert("Gagal menghapus data kelas dari Supabase: " + error.message);
      } else {
        setClasses(classes.filter((c) => c.id !== id));
      }
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
            <p className="text-sm">Menghubungkan ke Supabase...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Nama Kelas</th>
                  <th className="px-6 py-4">Tingkat (Grade)</th>
                  <th className="px-6 py-4">Siswa (Voters)</th>
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
                        Tingkat {item.grade}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.voterCount} Siswa
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          
                          <Dialog open={isEditOpen && editingClassId === item.id} onOpenChange={(open) => !open && setIsEditOpen(false)}>
                            <DialogTrigger asChild>
                              <button 
                                onClick={() => handleOpenEdit(item)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Kelas"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Nama Kelas</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <input
                                  type="text"
                                  placeholder="Masukkan Nama Kelas Baru"
                                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                  value={editClassName}
                                  onChange={(e) => setEditClassName(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                                />
                              </div>
                              <DialogFooter className="gap-2 sm:gap-0">
                                <button
                                  type="button"
                                  onClick={() => setIsEditOpen(false)}
                                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                  Batal
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSaveEdit}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                  Simpan Perubahan
                                </button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

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
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                      Tidak ada data kelas ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}