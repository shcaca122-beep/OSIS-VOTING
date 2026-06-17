"use server";

import { createClient } from "@/utils/supabase/server";

// ==========================================
// 1. FUNGSI LOGIN ADMIN
// ==========================================
export async function loginAdmin(formData: FormData) {
  const email = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createClient();

    // Autentikasi akun ke Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return {
        success: false,
        error: "Kredensial salah atau akun tidak ditemukan.",
      };
    }

    // Otorisasi: Periksa apakah user ID ini ada di tabel 'admins'
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (adminError || !adminData) {
      // Jika tidak terdaftar di tabel admin, paksa logout demi keamanan sistem
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Akses ditolak. Anda bukan administrator resmi.",
      };
    }

    return { success: true, role: adminData.role };
  } catch (err) {
    console.error("Kesalahan sistem saat login admin:", err);
    return { success: false, error: "Terjadi kesalahan internal pada server." };
  }
} // <-- Kurung kurawal penutup loginAdmin yang benar di sini

// ==========================================
// 2. FUNGSI VERIFIKASI PIN PEMILIH (VOTER)
// ==========================================
export async function verifyVoterPin(pin: string) {
  const supabase = await createClient();

  // Memperbaiki nama tabel menjadi 'tokens' dan kolom menjadi 'token_code'
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("token_code", pin)
    .eq("is_used", false) // Memastikan token belum pernah dipakai voting
    .single();

  if (error || !data) {
    return {
      success: false,
      error: "PIN tidak valid atau sudah digunakan",
    };
  }

  return {
    success: true,
    voter: data,
  };
}

// ==========================================
// 3. FUNGSI LOGOUT ADMIN
// ==========================================
export async function logoutAdmin() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Kesalahan saat logout admin:", err);
    return { success: false, error: "Gagal melakukan logout." };
  }
}