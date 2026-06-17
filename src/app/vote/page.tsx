"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr"; 
import {
  LogOut,
  Eye,
  Target,
  CheckCircle2,
  Gavel,
  Info,
  Check,
  Vote,
} from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Candidate {
  id: string;
  orderNumber: string;
  chairman: { name: string; image: string };
  viceChairman: { name: string; image: string };
  vision: string;
  missions: string[];
}

export default function VotePage() {
  const router = useRouter();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const { data, error } = await supabase
          .from("candidates")
          .select("*")
          .order("order_number", { ascending: true });

        if (error) {
          console.error("Supabase Error:", error);
          alert("Gagal mengambil data dari Supabase: " + error.message);
          return;
        }

        if (data) {
          const mappedCandidates = data.map((item: any) => {
            const photos = typeof item.photo_urls === "string" 
              ? JSON.parse(item.photo_urls || "{}") 
              : (item.photo_urls || {});

            return {
              id: item.id,
              orderNumber: item.order_number || "01",
              chairman: {
                name: item.chairman_name,
                image: photos.chairman || "/pict/placeholder.jpg",
              },
              viceChairman: {
                name: item.vice_chairman_name,
                image: photos.viceChairman || "/pict/placeholder.jpg",
              },
              vision: item.vision,
              missions: Array.isArray(item.missions) 
                ? item.missions 
                : JSON.parse(item.missions || "[]"),
            };
          });

          setCandidates(mappedCandidates);
        }
      } catch (error: any) {
        console.error("Gagal mengambil data paslon:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("voter_token");
    router.push("/");
  };

  const handleViewDetail = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  const handleVoteConfirmation = () => {
    setIsDrawerOpen(false);
    setIsConfirmOpen(true);
  };

  const finalSubmitVote = async () => {
    setIsConfirmOpen(false);
    
    // Fallback otomatis ke token '777888' jika localStorage kosong untuk keperluan testing
    const token = localStorage.getItem("voter_token") || "777888";

    if (!selectedCandidate) {
      alert("Kandidat belum terpilih!");
      return;
    }

    try {
      // 1. MASUKKAN SUARA KE TABEL 'votes'
      const { error: voteError } = await supabase
        .from("votes")
        .insert([{ candidate_id: selectedCandidate.id }]);

      if (voteError) {
        throw new Error("Gagal menyimpan suara: " + voteError.message);
      }

      // 2. UPDATE STATUS TOKEN JADI HANGUS (TRUE)
      const { error: tokenError } = await supabase
        .from("tokens")
        .update({ is_used: true })
        .eq("token_code", token);

      if (tokenError) {
        throw new Error("Gagal mengupdate token: " + tokenError.message);
      }

      console.log("Suara sah berhasil disimpan, token hangus:", token);
      
      localStorage.removeItem("voter_token");
      router.push("/success");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">Memuat data kandidat paslon...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 antialiased min-h-screen relative flex flex-col">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-lg border-b border-white/40 z-40 shadow-sm">
        <div className="flex justify-between items-center h-16 px-4 max-w-md mx-auto">
          <h1 className="text-xl font-bold text-blue-600 tracking-tight">OSIS Portal</h1>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:bg-slate-100 hover:text-red-500 active:scale-95 transition-all p-2 rounded-full"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md pt-24 px-4 flex flex-col gap-8 grow w-full">
        <section className="text-center mt-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Pilih Pemimpinmu</h2>
          <p className="text-sm text-slate-500 leading-relaxed px-2">
            Gunakan hak suaramu dengan bijak untuk masa depan sekolah yang lebih baik.
          </p>
        </section>

        <section className="flex flex-col gap-6">
          {candidates.map((paslon, index) => (
            <article
              key={paslon.id}
              className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden shadow-sm"
            >
              <div className="absolute -top-6 -right-2 text-9xl font-bold text-blue-600/5 select-none pointer-events-none">
                {paslon.orderNumber}
              </div>

              <div className="flex justify-between items-start z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                  {paslon.orderNumber}
                </div>
              </div>

              <div className="flex gap-4 z-10">
                <div className="flex-1 aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                  {paslon.chairman.image && (
                    <Image
                      src={paslon.chairman.image}
                      alt={`Calon Ketua ${paslon.orderNumber}`}
                      fill
                      unoptimized
                      priority={index === 0}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3 pt-8">
                    <span className="text-white text-xs font-medium">Ketua</span>
                  </div>
                </div>
                <div className="flex-1 aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                  {paslon.viceChairman.image && (
                    <Image
                      src={paslon.viceChairman.image}
                      alt={`Calon Wakil ${paslon.orderNumber}`}
                      fill
                      unoptimized
                      priority={index === 0}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3 pt-8">
                    <span className="text-white text-xs font-medium">Wakil</span>
                  </div>
                </div>
              </div>

              <div className="z-10 mt-2">
                <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                  {paslon.chairman.name} &amp;
                  <br />
                  {paslon.viceChairman.name}
                </h3>
                <button
                  onClick={() => handleViewDetail(paslon)}
                  className="mt-5 w-full py-3.5 rounded-xl border-2 border-blue-600 text-blue-600 font-medium active:scale-[0.98] transition-all duration-200 hover:bg-blue-50 flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Lihat Visi &amp; Misi
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="mt-8 py-8 w-full border-t border-slate-200/60 bg-slate-50/50">
        <div className="max-w-md mx-auto text-center px-4">
          <p className="text-xs text-slate-500 font-medium">&copy; 2026 KPU OSIS SMK Budi Bakti Ciwidey</p>
          <p className="text-[10px] text-slate-400 mt-1.5 tracking-wide">Dikembangkan oleh Teaching Factory PPLG</p>
        </div>
      </footer>

      {/* DRAWER VISI MISI */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-white/95 backdrop-blur-xl border-t border-slate-200 max-h-[90vh]">
          <div className="mx-auto w-full max-w-md flex flex-col h-full">
            <DrawerHeader className="text-left border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <span className="font-bold text-lg">{selectedCandidate?.orderNumber}</span>
                </div>
                <div>
                  <DrawerTitle className="text-lg font-bold text-slate-900">Visi &amp; Misi</DrawerTitle>
                  <DrawerDescription className="text-xs text-slate-500 mt-0.5">
                    {selectedCandidate?.chairman.name} &amp; {selectedCandidate?.viceChairman.name}
                  </DrawerDescription>
                </div>
              </div>
            </DrawerHeader>

            <div className="p-4 overflow-y-auto space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-slate-900">Visi</h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed italic text-center">
                    &quot;{selectedCandidate?.vision}&quot;
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-slate-900">Misi</h4>
                </div>
                <div className="space-y-3">
                  {selectedCandidate?.missions.map((mission, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-slate-600 leading-relaxed">{mission}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <DrawerFooter className="border-t border-slate-100 pt-4 bg-white/80">
              <button
                onClick={handleVoteConfirmation}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 flex justify-center items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Pilih Kandidat Ini
              </button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* CONFIRMATION DIALOG */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-white/40 rounded-xl p-6 shadow-xl shadow-blue-500/20 flex flex-col gap-6">
          <AlertDialogHeader className="text-left flex flex-row items-center gap-3 space-y-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">Konfirmasi Pilihan Anda</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-white shadow-sm relative">
              {selectedCandidate?.chairman.image && (
                <Image
                  src={selectedCandidate?.chairman.image || ""}
                  alt="Foto Kandidat Terpilih"
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <Check className="w-3 h-3" />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1 font-medium">Kandidat Terpilih</p>
              <p className="text-lg font-bold text-slate-900">Paslon No. {selectedCandidate?.orderNumber}</p>
              <p className="text-sm text-slate-600">
                {selectedCandidate?.chairman.name} &amp; {selectedCandidate?.viceChairman.name}
              </p>
            </div>
          </div>

          <AlertDialogDescription asChild>
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 flex gap-2 items-start">
              <Gavel className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-600 leading-relaxed block">
                Dengan menekan tombol konfirmasi, Anda menggunakan hak suara Anda secara sah. Pilihan tidak dapat diubah setelah disubmit.
              </span>
            </div>
          </AlertDialogDescription>

          <AlertDialogFooter className="flex-col gap-3 sm:flex-col sm:space-x-0 mt-2">
            <AlertDialogAction
              onClick={finalSubmitVote}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium active:scale-[0.98] transition-transform duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 m-0"
            >
              Ya, Saya Yakin
              <Vote className="w-5 h-5" />
            </AlertDialogAction>
            <AlertDialogCancel className="w-full py-6 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-medium active:scale-[0.98] transition-transform duration-200 m-0 mt-3 sm:mt-0">
              Batal
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}