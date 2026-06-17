export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Sistem</h1>
        <p className="text-slate-500 mt-1">Atur jadwal pemilihan dan status aplikasi E-Voting.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Nama Acara Pemilihan</label>
            <input type="text" defaultValue="Pemilihan Ketua OSIS 2026/2027" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Waktu Mulai</label>
              <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Waktu Selesai</label>
              <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-slate-100">
            <div>
              <h4 className="font-semibold text-slate-800">Status E-Voting</h4>
              <p className="text-sm text-slate-500 mt-1">Buka akses agar siswa bisa mulai memilih.</p>
            </div>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button type="button" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}