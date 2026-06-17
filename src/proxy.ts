import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";
 
// Next.js Turbopack terkadang mencari nama fungsi 'proxy' atau 'middleware'
// Kita buat fungsi utama yang memanggil updateSession secara transparan
export async function proxy(request: NextRequest) {
  console.log("-> Satpam Proxy mendeteksi rute:", request.nextUrl.pathname);
  return await updateSession(request);
}

export async function middleware(request: NextRequest) {
  return await proxy(request);
}
 
// Kita kunci matcher-nya langsung ke rute admin agar tidak meleset
export const config = {
  matcher: ["/admin/:path*"],
};