"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Award, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export const dynamic = 'force-dynamic';

interface PaslonData {
  id: string;
  nomorUrut: string; // Tetap string di UI untuk kenyamanan input, dikonversi ke number saat ke DB
  namaKetua: string;
  namaWakil: string;
  fotoUrl: string;
  visi: string;
  misi: string;
}

// Data mentahan awal sebagai fallback jika database kosong
const initialPaslon: PaslonData[] = [
  {
    id: "p-1",
    nomorUrut: "01",
    namaKetua: "JEONG-JAEHYUN",
    namaWakil: "MARKLEE",
    fotoUrl: "/pict/paslon 1.jpg",
    visi: "Mewujudkan OSIS sebagai wadah inkubasi kreativitas digital dan kepemimpinan siswa yang adaptif di era teknologi.",
    misi: "Mengoptimalkan kegiatan ekstrakurikuler berbasis digital kreatif dan menyelenggarakan forum aspirasi terbuka antar siswa.",
  },
  {
    id: "p-2",
    nomorUrut: "02",
    namaKetua: "KIM YOUJUNG",
    namaWakil: "SONGKANG",
    fotoUrl: "/pict/paslon 2.jpg",
    visi: "Membangun lingkungan sekolah yang inklusif, kolaboratif, serta aktif dalam pelestarian budaya daerah dan seni kreatif.",
    misi: "Mengadakan festival seni berkala, mempererat hubungan antar organisasi intra sekolah, serta meningkatkan kepedulian sosial.",
  },
  {
    id: "p-3",
    nomorUrut: "03",
    namaKetua: "MOON GA YOUNG",
    namaWakil: "HWANG IN YOUP",
    fotoUrl: "/pict/paslon 3.jpg",
    visi: "Meningkatkan sinergi antar siswa dan guru berbasis nilai kedisiplinan serta pemanfaatan platform digital sekolah secara optimal.",
    misi: "Modernisasi sistem mading digital sekolah dan memperluas jaringan kerja sama eksternal untuk program magang/workshop.",
  },
];

export default function DataPaslonPage() {
  const [paslonList, setPaslonList] = useState<PaslonData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Tambah
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newNo, setNewNo] = useState("");
  const [newKetua, setNewKetua] = useState("");
  const [newWakil, setNewWakil] = useState("");
  const [newFoto, setNewFoto] = useState("");
  const [newVisi, setNewVisi] = useState("");
  const [newMisi, setNewMisi] = useState("");

  // State Modal Edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNo, setEditNo] = useState("");
  const [editKetua, setEditKetua] = useState("");
  const [editWakil, setEditWakil] = useState("");
  const [editFoto, setEditFoto] = useState("");
  const [editVisi, setEditVisi] = useState("");
  const [editMisi, setEditMisi] = useState("");

  // 1. AMBIL DATA DARI SUPABASE (READ - Menuju tabel candidates)
  const fetchPaslon = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("order_number", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedData: PaslonData[] = data.map((item: any) => {
          // Konversi array missions & photo_urls kembali ke string untuk UI card kamu
          const misiString = Array.isArray(item.missions) ? item.missions.join("\n") : (item.missions || "");
          const fotoString = Array.isArray(item.photo_urls) ? item.photo_urls[0] : (item.photo_urls || "");

          return {
            id: item.id,
            nomorUrut: String(item.order_number).padStart(2, "0"),
            namaKetua: item.chairman_name || "",
            namaWakil: item.vice_chairman_name || "",
            fotoUrl: fotoString || "/pict/paslon 1.jpg",
            visi: item.vision || "",
            misi: misiString,
          };
        });
        setPaslonList(mappedData);
      } else {
        setPaslonList(initialPaslon);
      }
    } catch (error) {
      console.error("Gagal mengambil data database, menggunakan data mentahan lokal.", error);
      setPaslonList(initialPaslon);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaslon();
  }, []);

  // Filter Berdasarkan Pencarian
  const filteredPaslon = paslonList.filter(
    (p) =>
      p.namaKetua?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.namaWakil?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nomorUrut?.includes(searchQuery)
  );

  // 2. AKSI TAMBAH PASLON (CREATE)
  const handleAddPaslon = async () => {
    if (!newNo || !newKetua || !newWakil) return;

    const formattedFotoPath = (newFoto.trim() || "/pict/paslon 1.jpg").replace(/ /g, "%20");
    
    // Pecah string misi per baris menjadi Array JSON agar masuk kriteria kolom jsonb
    const missionsArray = newMisi.split("\n").map(m => m.trim()).filter(m => m.length > 0);
    const photosArray = [formattedFotoPath];

    const { data, error } = await supabase
      .from("candidates")
      .insert([
        {
          order_number: parseInt(newNo, 10) || 1,
          chairman_name: newKetua,
          vice_chairman_name: newWakil,
          photo_urls: photosArray,
          vision: newVisi,
          missions: missionsArray,
        },
      ])
      .select();

    if (error) {
      alert("Gagal menyimpan ke Supabase: " + error.message);
    } else if (data && data[0]) {
      const resData = data[0];
      const newItem: PaslonData = {
        id: resData.id,
        nomorUrut: String(resData.order_number).padStart(2, "0"),
        namaKetua: resData.chairman_name,
        namaWakil: resData.vice_chairman_name,
        fotoUrl: Array.isArray(resData.photo_urls) ? resData.photo_urls[0] : resData.photo_urls,
        visi: resData.vision,
        misi: Array.isArray(resData.missions) ? resData.missions.join("\n") : resData.missions,
      };
      setPaslonList([...paslonList, newItem].sort((a,b) => parseInt(a.nomorUrut) - parseInt(b.nomorUrut)));
      setIsAddOpen(false);
      setNewNo(""); setNewKetua(""); setNewWakil(""); setNewFoto(""); setNewVisi(""); setNewMisi("");
    }
  };

  // Membuka Modal Edit
  const handleOpenEdit = (p: PaslonData) => {
    setEditingId(p.id);
    setEditNo(p.nomorUrut);
    setEditKetua(p.namaKetua);
    setEditWakil(p.namaWakil);
    setEditFoto(p.fotoUrl);
    setEditVisi(p.visi);
    setEditMisi(p.misi);
    setIsEditOpen(true);
  };

  // 3. SIMPAN HASIL PERUBAHAN EDIT (UPDATE)
  const handleSaveEdit = async () => {
    if (!editingId || !editNo || !editKetua || !editWakil) return;

    const formattedEditFoto = editFoto.replace(/ /g, "%20");
    const missionsArray = editMisi.split("\n").map(m => m.trim()).filter(m => m.length > 0);
    const photosArray = [formattedEditFoto];

    // Jika ID bawaan lokal, update di state lokal saja
    if (editingId.startsWith("p-")) {
      setPaslonList(
        paslonList.map((p) =>
          p.id === editingId
            ? { ...p, nomorUrut: editNo, namaKetua: editKetua, namaWakil: editWakil, fotoUrl: formattedEditFoto, visi: editVisi, misi: editMisi }
            : p
        ).sort((a,b) => parseInt(a.nomorUrut) - parseInt(b.nomorUrut))
      );
      setIsEditOpen(false);
      setEditingId(null);
      return;
    }

    const { error } = await supabase
      .from("candidates")
      .update({
        order_number: parseInt(editNo, 10) || 1,
        chairman_name: editKetua,
        vice_chairman_name: editWakil,
        photo_urls: photosArray,
        vision: editVisi,
        missions: missionsArray,
      })
      .eq("id", editingId);

    if (error) {
      alert("Gagal memperbarui data di Supabase: " + error.message);
    } else {
      setPaslonList(
        paslonList.map((p) =>
          p.id === editingId
            ? { ...p, nomorUrut: editNo, namaKetua: editKetua, namaWakil: editWakil, fotoUrl: formattedEditFoto, visi: editVisi, misi: editMisi }
            : p
        ).sort((a,b) => parseInt(a.nomorUrut) - parseInt(b.nomorUrut))
      );
      setIsEditOpen(false);
      setEditingId(null);
    }
  };

  // 4. AKSI HAPUS PASLON (DELETE)
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data paslon ini?")) {
      if (id.startsWith("p-")) {
        setPaslonList(paslonList.filter((p) => p.id !== id));
        return;
      }

      const { error } = await supabase.from("candidates").delete().eq("id", id);

      if (error) {
        alert("Gagal menghapus dari Supabase: " + error.message);
      } else {
        setPaslonList(paslonList.filter((p) => p.id !== id));
      }
    }
  };

  return (
    <main className="pt-20 md:pt-8 px-4 md:px-8 pb-24 md:pb-8 w-full grow bg-slate-50/50 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Award className="w-4 h-4" /> Portal Administrator
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Kandidat Paslon OSIS
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola profil, visi, misi, dan foto resmi kandidat e-voting.
          </p>
        </div>

        {/* Dialog Tambah Paslon */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-blue-500/10 active:scale-[0.98]">
              <Plus className="w-5 h-5" />
              <span>Tambah Paslon</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Daftarkan Paslon Baru</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="font-medium text-slate-700 mb-1 block">No. Urut</label>
                  <input type="number" placeholder="1" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={newNo} onChange={(e) => setNewNo(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="font-medium text-slate-700 mb-1 block">Path/Link Foto Resmi</label>
                  <input type="text" placeholder="/pict/paslon 1.jpg atau URL" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={newFoto} onChange={(e) => setNewFoto(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="font-medium text-slate-700 mb-1 block">Nama Lengkap Ketua</label>
                <input type="text" placeholder="Nama Ketua" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={newKetua} onChange={(e) => setNewKetua(e.target.value)} />
              </div>
              <div>
                <label className="font-medium text-slate-700 mb-1 block">Nama Lengkap Wakil</label>
                <input type="text" placeholder="Nama Wakil" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={newWakil} onChange={(e) => setNewWakil(e.target.value)} />
              </div>
              <div>
                <label className="font-medium text-slate-700 mb-1 block">Visi</label>
                <textarea rows={2} placeholder="Tulis visi paslon..." className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={newVisi} onChange={(e) => setNewVisi(e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium text-slate-700">Misi</label>
                  <span className="text-[10px] text-slate-400">Tekan Enter untuk baris baru (tiap poin)</span>
                </div>
                <textarea rows={3} placeholder="Misi 1&#10;Misi 2" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={newMisi} onChange={(e) => setNewMisi(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Batal</button>
              <button onClick={handleAddPaslon} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Daftarkan</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Input Cari */}
      <div className="mb-8 max-w-md bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            placeholder="Cari nomor atau nama kandidat..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading Spinner Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm">Menghubungkan ke Supabase...</p>
        </div>
      ) : (
        /* Grid Card List Paslon */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPaslon.map((item) => (
            <div key={item.id} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              
              {/* Foto Section */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.fotoUrl}
                  alt={`Foto Paslon ${item.nomorUrut}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                
                {/* Badge Nomor */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-white/40 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase leading-none">PASLON</span>
                  <span className="text-2xl font-black text-blue-600 leading-none mt-0.5">{item.nomorUrut}</span>
                </div>

                {/* Teks Nama Di Atas Foto */}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="text-xl font-bold tracking-tight leading-tight mb-0.5 drop-shadow-sm">{item.namaKetua}</h3>
                  <p className="text-xs text-slate-200 font-medium tracking-wide flex items-center gap-1.5 opacity-90">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Wakil: {item.namaWakil}
                  </p>
                </div>
              </div>

              {/* Visi Misi Section */}
              <div className="p-6 flex flex-col grow bg-gradient-to-b from-white to-slate-50/30 justify-between">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-blue-500" /> Visi Utama
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{item.visi || "Belum ada visi tertulis."}"
                    </p>
                  </div>
                  {item.misi && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Misi Utama
                      </h4>
                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                        {item.misi.split("\n").map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi di Pojok Bawah Card */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Edit Paslon */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Ubah Profil Paslon</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="font-medium text-slate-700 mb-1 block">No. Urut</label>
                <input type="number" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={editNo} onChange={(e) => setEditNo(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="font-medium text-slate-700 mb-1 block">Path/Link Foto Resmi</label>
                <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={editFoto} onChange={(e) => setEditFoto(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="font-medium text-slate-700 mb-1 block">Nama Ketua</label>
              <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={editKetua} onChange={(e) => setEditKetua(e.target.value)} />
            </div>
            <div>
              <label className="font-medium text-slate-700 mb-1 block">Nama Wakil</label>
              <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={editWakil} onChange={(e) => setEditWakil(e.target.value)} />
            </div>
            <div>
              <label className="font-medium text-slate-700 mb-1 block">Visi</label>
              <textarea rows={2} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={editVisi} onChange={(e) => setEditVisi(e.target.value)} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-slate-700">Misi</label>
                <span className="text-[10px] text-slate-400">Tekan Enter untuk memisahkan poin misi</span>
              </div>
              <textarea rows={3} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" value={editMisi} onChange={(e) => setEditMisi(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">Batal</button>
            <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}