export default function PemilihPage() {
  const pemilihData = [
    { nis: "100123", nama: "Gesya Fikry Ramadhan", kelas: "X.PPLG-1", status: "Sudah Voting" },
    { nis: "100124", nama: "Kafka Lyandra ", kelas: "X.DKV-2", status: "Belum Voting" },
    { nis: "100125", nama: "Rangga Wishesha", kelas: "XI.BRP-1", status: "Sudah Voting" },
    { nis: "100126", nama: "Rafif Fadlan", kelas: "XII.PPLG-2", status: "Belum Voting" },
    { nis: "100127", nama: "Jeong-Jaehyun", kelas: "X.BRP-1", status: "Sudah Voting" },
    { nis: "100128", nama: "Keonho", kelas: "XI.DKV-1", status: "Belum Voting" },
    { nis: "100129", nama: "Jeno", kelas: "XII.BRP-2", status: "Sudah Voting" },
    { nis: "100130", nama: "Mark", kelas: "XII.DKV-1", status: "Belum Voting" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Pemilih Tetap</h1>
          <p className="text-slate-500 mt-1">Kelola daftar siswa yang berhak memberikan suara.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          + Tambah Pemilih
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <input 
            type="text" 
            placeholder="Cari nama atau NIS..." 
            className="w-full max-w-sm border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white border-b border-slate-200 text-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">NIS</th>
                <th className="px-6 py-4 font-semibold">Nama Siswa</th>
                <th className="px-6 py-4 font-semibold">Kelas</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pemilihData.map((pemilih, index) => (
                <tr key={index} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">{pemilih.nis}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{pemilih.nama}</td>
                  <td className="px-6 py-4">{pemilih.kelas}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pemilih.status === "Sudah Voting" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {pemilih.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}