'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import MenuPage from '../../page'; // Import จากหน้าเดิม!
import CartButton from '@/components/cart/CartButton';

export default function TableMenuPage() {
  const params = useParams();
  const { setTableId } = useCart();
  const tableId = params.tableId as string;

  useEffect(() => {
    if (tableId) setTableId(tableId);
  }, [tableId]);

  return (
    <>
      {/* เรียกใช้หน้าเดิมที่มีอยู่แล้ว */}
      <MenuPage />
      
      {/* เพิ่มปุ่มตะกร้าเข้าไป */}
      <CartButton />
    </>
  );
}