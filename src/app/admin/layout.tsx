'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
// เปลี่ยนเป็น any ก่อนเพื่อทดสอบ
export default function TablesManagementPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newSeatCount, setNewSeatCount] = useState(4);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tables')
      .select('*')
      .order('table_number');
    
    setTables(data || []);
    setLoading(false);
  };

  const generateQR = (tableId: number) => {
    const baseUrl = window.location.origin;
    const qrUrl = `${baseUrl}/table/${tableId}`;
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`, '_blank');
  };

  const addTable = async () => {
    if (!newTableNumber) return;
    
    const { error } = await supabase
      .from('tables')
      .insert({
        table_number: newTableNumber,
        seat_count: newSeatCount,
        status: 'available'
      });

    if (!error) {
      setNewTableNumber('');
      fetchTables();
    } else {
      alert('ไม่สามารถเพิ่มโต๊ะได้: ' + error.message);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await supabase.from('tables').update({ status }).eq('id', id);
    fetchTables();
  };

  if (loading) return <div className="p-8 text-center">กำลังโหลด...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#D4A574]">จัดการโต๊ะ</h1>
      
      <div className="bg-[#1A1A1A] p-4 rounded-xl mb-6 border border-[#2C1810]">
        <h3 className="text-white mb-4">เพิ่มโต๊ะใหม่</h3>
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="หมายเลขโต๊ะ (เช่น 1, A1)"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
            className="px-4 py-2 bg-[#0a0a0a] border border-[#2C1810] rounded-lg text-white"
          />
          <select
            value={newSeatCount}
            onChange={(e) => setNewSeatCount(Number(e.target.value))}
            className="px-4 py-2 bg-[#0a0a0a] border border-[#2C1810] rounded-lg text-white"
          >
            {[2, 4, 6, 8].map(n => (
              <option key={n} value={n}>{n} ที่นั่ง</option>
            ))}
          </select>
          <button
            onClick={addTable}
            className="px-6 py-2 bg-[#D4A574] text-black rounded-lg hover:bg-[#E5B685]"
          >
            เพิ่มโต๊ะ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2C1810]">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-[#D4A574]">โต๊ะ {table.table_number}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                table.status === 'available' ? 'bg-green-900 text-green-400' :
                table.status === 'occupied' ? 'bg-red-900 text-red-400' :
                'bg-yellow-900 text-yellow-400'
              }`}>
                {table.status === 'available' ? 'ว่าง' : 
                 table.status === 'occupied' ? 'มีลูกค้า' : 
                 table.status === 'cleaning' ? 'กำลังทำความสะอาด' : 'จอง'}
              </span>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{table.seat_count} ที่นั่ง</p>
            
            <div className="space-y-2">
              <button
                onClick={() => generateQR(table.id)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                ดู QR Code
              </button>
              
              <select
                value={table.status}
                onChange={(e) => updateStatus(table.id, e.target.value)}
                className="w-full px-2 py-2 bg-[#0a0a0a] border border-[#2C1810] rounded-lg text-white text-sm"
              >
                <option value="available">ว่าง</option>
                <option value="occupied">มีลูกค้า</option>
                <option value="cleaning">ทำความสะอาด</option>
                <option value="
