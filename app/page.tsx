'use client';
import { useState, useEffect } from 'react';
import { UserButton, useUser, RedirectToSignIn } from '@clerk/nextjs';

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser(); 
  const [item, setItem] = useState('');
  const [date, setDate] = useState('');
  const [senaraiBarang, setSenaraiBarang] = useState<any[]>([]);

  const tarikData = async () => {
    if (!user) return; // Pastikan user dah login baru jalan
    
    const userEmail = user.primaryEmailAddress?.emailAddress;
    
    try {
      // Hantar e-mel sekali masa panggil API
      const res = await fetch(`/api/get-items?email=${userEmail}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setSenaraiBarang(data);
      } else {
        console.error("Error dari API:", data);
        setSenaraiBarang([]); 
      }
    } catch (error) {
      console.error("Gagal sambung ke API", error);
      setSenaraiBarang([]);
    }
  };

  // Run fungsi tarikData bila user dah sah login
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      tarikData();
    }
  }, [isLoaded, isSignedIn, user]);

  const hantarData = async () => {
    if (!user) return alert("Sila login dulu bro!");
    
    const userEmail = user.primaryEmailAddress?.emailAddress;

    const res = await fetch('/api/add-item', {
      method: 'POST',
      body: JSON.stringify({ 
        user_email: userEmail, 
        item_name: item, 
        expiry_date: date 
      }),
    });
    const data = await res.json();
    alert(data.message || data.error);
    
    setItem('');
    setDate('');
    tarikData(); // Auto refresh jadual lepas tambah barang
  };

  if (!isLoaded) return <div className="p-10 text-center text-xl font-bold">Tengah loading bro...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <main className="p-10 flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-blue-600">Freezer Reminder 🧊</h1>
        <UserButton />
      </div>
      
      <div className="flex flex-col gap-3 p-5 bg-gray-100 rounded-lg shadow">
        <h2 className="font-semibold text-black">Tambah Barang Baru</h2>
        <input type="text" placeholder="Nama Barang (Cth: Daging Ayam)" className="border p-2 text-black rounded" 
               value={item} onChange={(e) => setItem(e.target.value)} />
        <input type="date" className="border p-2 text-black rounded" 
               value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={hantarData} className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded transition-all">
          Simpan ke Freezer
        </button>
      </div>

      <div className="mt-5">
        <h2 className="font-semibold text-xl mb-3">Senarai Barang Dalam Freezer</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-blue-100 text-black">
              <tr>
                <th className="py-2 px-4 border-b text-left">Nama Barang</th>
                <th className="py-2 px-4 border-b text-left">Tarikh Luput</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {senaraiBarang.map((barang, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{barang.item_name}</td>
                  <td className="py-2 px-4 border-b">{barang.expiry_date}</td>
                  <td className="py-2 px-4 border-b">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {barang.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {senaraiBarang.length === 0 && (
            <p className="text-center text-gray-500 mt-4">Freezer kau kosong lagi bro!</p>
          )}
        </div>
      </div>
    </main>
  );
}