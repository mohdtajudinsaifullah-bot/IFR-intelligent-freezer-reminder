'use client';
import { useState, useEffect, useMemo } from 'react';
import { UserButton, useUser, RedirectToSignIn } from '@clerk/nextjs';

// --- IKON-IKON MENARIK DARI HEROICONS ---
const IconFreezer = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75M6.75 19.5a3.375 3.375 0 0 1-3.375-3.375V6.125C3.375 3.912 5.162 2.125 7.375 2.125h9.25c2.213 0 4 .125 4 2.125v10.125C20.625 17.162 18.838 19.5 16.625 19.5H6.75Z" /></svg>;
const IconCabinet = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H21m-10.5-15v15m0-15v15" /></svg>;
const IconLaci = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6a3.375 3.375 0 0 1 3.375-3.375h10.5a3.375 3.375 0 0 1 3.375 3.375M3.75 6h16.5m-16.5 0v10.5c0 1.105.895 2.125 2.125 2.125h12.125c1.105 0 2.125-.895 2.125-2.125V6M12 12h.008v.008H12V12Z" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.166L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const IconAlert = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;

// --- IKON BARU UNTUK KATEGORI ---
const IconDroplet = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.963 2.578a.196.196 0 00-.318 0 8.01 8.01 0 01-5.96 2.892 4.003 4.003 0 00-1.93 3.28 7.002 7.002 0 0011.66 6.883 4.003 4.003 0 00-1.93-3.28 8.01 8.01 0 01-5.96-2.892z" /></svg>; // Icon Wet/Basah
const IconCake = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>; // Icon RTE
const IconCube = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>; // Icon Dry/Kering

// --- UTILITI UNTUK KIRA BAKI HARI ---
const calculateDaysLeft = (expiryDateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const expiryDate = new Date(expiryDateStr);
  
  if (isNaN(expiryDate.getTime())) return 999; 

  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};

// --- MAPPING LOKASI & KATEGORI (KEBAL TAILWIND PRODUCTION) ---
const locationMap: {[key: string]: {label: string, icon: any}} = {
  peti: {label: 'Peti Ais / Freezer', icon: <IconFreezer />},
  laci: {label: 'Laci / Storage Box', icon: <IconLaci />},
  almari: {label: 'Almari / Kabinet', icon: <IconCabinet />},
};

const categoryMap: {[key: string]: {label: string, icon: any, theme: any}} = {
  kering: {
    label: 'Kering (Dry)', 
    icon: <IconCube />, 
    theme: { wrapper: 'border-amber-500 bg-amber-50 ring-2 ring-amber-200', icon: 'text-amber-600', text: 'text-amber-800', badge: 'text-amber-700 bg-amber-50' }
  },
  basah: {
    label: 'Basah (Wet)', 
    icon: <IconDroplet />, 
    theme: { wrapper: 'border-blue-500 bg-blue-50 ring-2 ring-blue-200', icon: 'text-blue-600', text: 'text-blue-800', badge: 'text-blue-700 bg-blue-50' }
  },
  rte: {
    label: 'Siap Masak (Ready-to-Eat)', 
    icon: <IconCake />, 
    theme: { wrapper: 'border-red-500 bg-red-50 ring-2 ring-red-200', icon: 'text-red-600', text: 'text-red-800', badge: 'text-red-700 bg-red-50' }
  },
};

// --- UTAMA ---
export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser(); 
  const [item, setItem] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('peti');
  const [category, setCategory] = useState('kering'); 
  const [senaraiBarang, setSenaraiBarang] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('semua'); 

  const tarikData = async () => {
    if (!user) return;
    const userEmail = user.primaryEmailAddress?.emailAddress;
    
    try {
      const res = await fetch(`/api/get-items?email=${userEmail}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const sortedData = data.sort((a:any, b:any) => calculateDaysLeft(a.expiry_date) - calculateDaysLeft(b.expiry_date));
        setSenaraiBarang(sortedData);
      } else {
        console.error("Error dari API:", data);
        setSenaraiBarang([]); 
      }
    } catch (error) {
      console.error("Gagal sambung ke API", error);
      setSenaraiBarang([]);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      tarikData();
    }
  }, [isLoaded, isSignedIn, user]);

  const hantarData = async () => {
    if (!user) return alert("Sila login dulu bro!");
    if (!item || !date) return alert("Sila isi nama barang dan tarikh luput.");
    
    const userEmail = user.primaryEmailAddress?.emailAddress;

    const res = await fetch('/api/add-item', {
      method: 'POST',
      body: JSON.stringify({ 
        user_email: userEmail, 
        item_name: item, 
        expiry_date: date,
        location: location,
        category: category 
      }),
    });
    const data = await res.json();
    alert(data.message || data.error);
    
    setItem('');
    setDate('');
    setLocation('peti');
    setCategory('kering'); 
    tarikData();
  };

  const padamData = async (itemId: number) => {
    if (!user) return;
    if (!confirm('Kau confirm nak padam barang ni bro?')) return;

    try {
      const res = await fetch('/api/delete-item', {
        method: 'POST',
        body: JSON.stringify({ item_id: itemId }),
      });
      const data = await res.json();
      
      if (data.message) {
        alert(data.message);
        tarikData(); 
      } else {
        alert('Gagal padam: ' + data.error);
      }
    } catch (error) {
      console.error("Gagal panggil API padam", error);
      alert('Gagal panggil API padam');
    }
  };

  // --- LOGIK DASHBOARD & PENAPISAN ---
  const barangWithDays = useMemo(() => {
    return senaraiBarang.map(barang => ({
      ...barang,
      daysLeft: calculateDaysLeft(barang.expiry_date),
    }));
  }, [senaraiBarang]);

  const countBasahCritical = barangWithDays.filter(b => b.category === 'basah' && b.daysLeft >= 0 && b.daysLeft <= 3).length; 
  const countRteCritical = barangWithDays.filter(b => b.category === 'rte' && b.daysLeft >= 0 && b.daysLeft <= 3).length; 
  const basahRteSum = countBasahCritical + countRteCritical;
  
  const countKeringWarning = barangWithDays.filter(b => b.category === 'kering' && b.daysLeft >= 0 && b.daysLeft <= 30).length; 
  const countSemua = senaraiBarang.length;

  const filteredSenarai = useMemo(() => {
    switch (activeFilter) {
      case 'kering':
        return barangWithDays.filter(b => b.category === 'kering' && b.daysLeft >= 0 && b.daysLeft <= 30); 
      case 'basah':
        return barangWithDays.filter(b => b.category === 'basah'); 
      case 'rte':
        return barangWithDays.filter(b => b.category === 'rte' && b.daysLeft >= 0 && b.daysLeft <= 3); 
      case 'expired':
        return barangWithDays.filter(b => b.daysLeft < 0); 
      default:
        return barangWithDays; 
    }
  }, [barangWithDays, activeFilter]);

  if (!isLoaded) return <div className="p-10 text-center text-xl font-bold">Tengah loading bro...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  const lokasiOptions = ['peti', 'laci', 'almari'];
  const kategoriOptions = ['kering', 'basah', 'rte'];

  return (
    <main className="p-6 md:p-10 flex flex-col gap-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      
      {/* HEADER CANTIK */}
      <div className="flex justify-between items-center border-b pb-4 bg-white p-5 rounded-xl shadow">
        <div className="flex items-center gap-3">
          <div className="text-blue-500 bg-blue-100 p-3 rounded-xl"><IconFreezer /></div>
          <h1 className="text-3xl font-bold text-gray-900">Kitchen Smart Manager <span className='text-sm text-gray-500'>[Freezer Reminder v2.1]</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-700 font-semibold">{user.firstName} {user.lastName}</p>
          <UserButton />
        </div>
      </div>
      
      {/* DASHBOARD KAD AMARAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-red-500 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="font-bold text-4xl">{basahRteSum}</p>
            <p className="font-medium mt-1">Barang Basah/RTE</p>
            <p className="text-xs text-red-100">Luput kurang 3 hari</p>
          </div>
          <IconAlert />
        </div>
        <div className="bg-amber-500 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="font-bold text-4xl">{countKeringWarning}</p>
            <p className="font-medium mt-1">Barang Kering</p>
            <p className="text-xs text-amber-100">Luput sebulan (Awas!)</p>
          </div>
          <IconAlert />
        </div>
        <div className="bg-gray-100 text-gray-900 p-6 rounded-2xl flex items-center justify-between shadow">
          <div>
            <p className="font-bold text-4xl">{countSemua}</p>
            <p className="font-medium mt-1 text-gray-700">Jumlah Barang</p>
            <p className="text-xs text-gray-500">Dalam simpanan</p>
          </div>
          <div className="text-gray-400"><IconPlus /></div>
        </div>
      </div>

      {/* FORM TAMBAH BARANG BARU */}
      <div className="flex flex-col gap-5 p-6 bg-white rounded-xl shadow-md">
        <div className="flex items-center gap-2 border-b pb-3 mb-1">
          <div className='text-blue-500 bg-blue-50 p-2 rounded-lg'><IconPlus /></div>
          <h2 className="text-2xl font-semibold text-gray-900">Tambah Barang Baru <span className='text-xs text-gray-500'>[Update Senarai Barang bro!]</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Nama Barang (Cth: Daging Ayam, Ikan Bilis, Nasi Tomato)" className="border p-3 text-black rounded-lg col-span-2 focus:ring-2 focus:ring-blue-300" 
                 value={item} onChange={(e) => setItem(e.target.value)} />
          <input type="date" className="border p-3 text-black rounded-lg focus:ring-2 focus:ring-blue-300" 
                 value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {/* --- MEDAN KATEGORI & LOKASI --- */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold text-gray-800">Simpan Di Mana Bro?</label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {lokasiOptions.map(opt => (
                  <label key={opt} className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer transition-all ${location === opt ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                    <input type="radio" name="location" value={opt} checked={location === opt} onChange={() => setLocation(opt)} className="w-5 h-5 text-blue-600" />
                    <div className={`${location === opt ? 'text-blue-600' : 'text-gray-500'}`}>{locationMap[opt].icon}</div>
                    <div className={`${location === opt ? 'text-blue-800' : 'text-gray-700'} font-medium`}>{locationMap[opt].label}</div>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="font-semibold text-gray-800">Kategori Barang Apa Ni?</label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {kategoriOptions.map(opt => {
                    const k = categoryMap[opt];
                    return (
                        <label key={opt} className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer transition-all ${category === opt ? k.theme.wrapper : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                            <input type="radio" name="category" value={opt} checked={category === opt} onChange={() => setCategory(opt)} className={`w-5 h-5 ${k.theme.icon}`} />
                            <div className={`${category === opt ? k.theme.icon : 'text-gray-500'}`}>{k.icon}</div>
                            <div className={`${category === opt ? k.theme.text : 'text-gray-700'} font-medium`}>{k.label}</div>
                        </label>
                    );
                })}
              </div>
            </div>
        </div>

        <button onClick={hantarData} className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-3">
          <IconPlus />
          Simpan
        </button>
      </div>

      {/* SENARAI BARANG */}
      <div className="mt-5 p-6 bg-white rounded-xl shadow-md">
        <h2 className="font-semibold text-2xl text-gray-900 mb-5">Senarai Barang Dalam Simpanan <span className='text-xs text-gray-500'>[Refreshed Bro!]</span></h2>
        
        {/* --- TAB PENAPISAN JADUAL --- */}
        <div className="flex border-b mb-6 overflow-x-auto">
          {[
            {key: 'semua', label: 'Semua'},
            {key: 'kering', label: 'Kering (<30 hari)'},
            {key: 'basah', label: 'Basah'}, 
            {key: 'rte', label: 'Siap Masak (Ready to Eat) (< 3 hari)'}, 
            {key: 'expired', label: 'Sudah Luput'},
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveFilter(tab.key)} className={`py-2.5 px-5 font-semibold text-sm whitespace-nowrap transition-all ${activeFilter === tab.key ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-t-lg' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* JADUAL BARANG */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-blue-100 text-gray-800 font-bold">
              <tr>
                <th className="py-3 px-4 border-b text-left">Nama Barang</th>
                <th className="py-3 px-4 border-b text-left">Lokasi</th>
                <th className="py-3 px-4 border-b text-left">Kategori</th>
                <th className="py-3 px-4 border-b text-left">Tarikh Luput</th>
                <th className="py-3 px-4 border-b text-left">Baki Hari</th>
                <th className="py-3 px-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {filteredSenarai.map((barang, index) => {
                const k = categoryMap[barang.category];
                const isExpired = barang.daysLeft < 0;
                const isKeringWarning = barang.category === 'kering' && barang.daysLeft >= 0 && barang.daysLeft <= 30;
                const isCritical = (barang.category === 'basah' || barang.category === 'rte') && barang.daysLeft >= 0 && barang.daysLeft <= 3;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{barang.item_name}</td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-400">{locationMap[barang.location].icon}</div>
                        <span className="font-medium text-gray-700">{locationMap[barang.location].label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full inline-flex font-semibold text-xs ${k.theme.badge}`}>
                            <div className={k.theme.icon}>{k.icon}</div>
                            {k.label}
                        </div>
                    </td>
                    <td className="py-3 px-4 border-b">{barang.expiry_date}</td>
                    <td className="py-3 px-4 border-b font-semibold">
                        {isExpired ? (
                            <span className="text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm">Sudah Luput ({Math.abs(barang.daysLeft)} hari)</span>
                        ) : isCritical ? (
                            <span className="text-red-800 bg-red-100 px-3 py-1 rounded-full text-sm">{barang.daysLeft} hari (Kritikal!)</span>
                        ) : isKeringWarning ? (
                            <span className="text-amber-800 bg-amber-100 px-3 py-1 rounded-full text-sm">{barang.daysLeft} hari (Awas!)</span>
                        ) : (
                            <span className="text-green-800 bg-green-100 px-3 py-1 rounded-full text-sm">{barang.daysLeft} hari</span>
                        )}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <button onClick={() => padamData(barang.id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-all" title="Padam Barang Bro">
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredSenarai.length === 0 && (
            <p className="text-center text-gray-500 mt-6 font-medium">Tiada barang untuk penapisan '{activeFilter}' bro!</p>
          )}
        </div>
      </div>
    </main>
  );
}