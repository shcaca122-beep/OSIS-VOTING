"use client";
 
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Users, LogOut, Vote } from "lucide-react";
 
export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
 
  const handleLogout = () => {
    // Logika hapus sesi admin akan ditempatkan di sini
    router.push("/admin/login");
  };
 
  const navItems = [
    {
      name: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Statistik", href: "/admin/statistik", icon: BarChart3 },
    { name: "Daftar Pemilih", href: "/admin/pemilih", icon: Vote },
    { name: "Data Kelas", href: "/admin/kelas", icon: Users },
  ];
 
  return (
    <aside className="hidden md:flex flex-col w-64 fixed h-full bg-white border-r border-slate-200 z-40 py-6 px-4 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
      <div className="text-2xl font-bold text-blue-600 tracking-tight mb-12 px-4">
        OSIS Portal
      </div>
 
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
 
      <div className="mt-auto pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

