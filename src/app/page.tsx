"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr"; 
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { GraduationCap, CircleHelp, Loader2, AlertCircle } from "lucide-react";

// Inisialisasi Supabase langsung di halaman login
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Menghapus karakter selain angka
    const cleanPin = pin.replace(/[^0-9]/g, ''); 

    if (cleanPin.length !== 6) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
     // 1. Cek langsung ke tabel 'tokens' di Supabase
      const { data, error } = await supabase
        .from("tokens")
        .select("*")
        .eq("token_code", cleanPin)
        .limit(1)
        .maybeSingle();

      // 2. Jika token tidak ada di database (DENGAN RADAR ERROR)
      if (error || !data) {
        setErrorMessage("Error DB: " + (error?.message || "Data benar-benar tidak ditemukan."));
        setIsLoading(false);
        setPin("");
        return;
      }

      // 3. Jika token ada tapi sudah dipakai (is_used: true)
      if (data.is_used) {
        setErrorMessage("PIN sudah pernah digunakan.");
        setIsLoading(false);
        setPin("");
        return;
      }

      // 4. JIKA LOLOS: Simpan token ke browser dan arahkan ke bilik suara
      localStorage.setItem("voter_token", cleanPin);
      router.push("/vote");

    } catch (err) {
      setErrorMessage("Terjadi gangguan koneksi. Coba lagi.");
      setIsLoading(false);
      setPin("");
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl -top-24 -left-24"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl -bottom-12 -right-12"></div>
      </div>

      <div className="w-full max-w-md mx-auto z-10">
        <div className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-xl p-8 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <GraduationCap
              className="text-blue-600 w-8 h-8"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center tracking-tight">
            Masuk ke Portal Suara
          </h1>
          <p className="text-sm text-slate-500 mb-8 text-center max-w-[280px] leading-relaxed">
            Masukkan 6 digit kode OTP yang telah diberikan oleh panitia
            pemilihan.
          </p>

          <form
            id="login-form"
            onSubmit={handleLogin}
            className="w-full flex flex-col items-center gap-6"
          >
            <div
              className="flex justify-center w-full"
              aria-label="Grup Input OTP"
            >
              <label htmlFor="otp-input" className="sr-only">
                Masukkan 6 digit PIN OTP
              </label>

              <InputOTP
                maxLength={6}
                value={pin}
                onChange={(value) => setPin(value)}
                disabled={isLoading}
                id="otp-input"
                name="otp-input"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-14 text-xl font-semibold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-14 text-xl font-semibold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-14 text-xl font-semibold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                </InputOTPGroup>

                <InputOTPSeparator className="text-slate-400 font-bold mx-1" />

                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-14 text-xl font-semibold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-14 text-xl font-semibold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-14 text-xl font-semibold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {errorMessage && (
              <div className="w-full bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 text-red-600 text-xs animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-normal">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pin.length !== 6 || isLoading}
              className="w-full py-4 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Memvalidasi...</span>
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-center w-full">
            <CircleHelp className="text-slate-500 w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-500">
              Butuh bantuan? Hubungi panitia.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}