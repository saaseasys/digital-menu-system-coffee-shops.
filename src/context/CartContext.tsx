// เพิ่ม interface ถ้ายังไม่มี
interface CartContextType {
  items: CartItem[];
  tableId: string | null;
  currentOrderId: string | null; // เพิ่มตัวนี้เก็บออเดอร์ที่กำลังทำอยู่
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setTableId: (id: string) => void;
  loadPendingOrder: (orderId: string) => Promise<void>; // โหลดออเดอร์ค้าง
  syncWithServer: () => Promise<void>; // sync กับ server
  total: number;
  itemCount: number;
  mounted: boolean;
}

// ใน CartProvider component เพิ่ม state:
const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

// ใน useEffect ตอน mount เพิ่ม:
useEffect(() => {
  setMounted(true);
  try {
    const savedCart = localStorage.getItem('brewmenu_cart');
    const savedTable = localStorage.getItem('brewmenu_tableId');
    const savedOrderId = localStorage.getItem('brewmenu_currentOrderId'); // เพิ่มบรรทัดนี้
    
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      setItems(Array.isArray(parsed) ? parsed : []);
    }
    if (savedTable) setTableIdState(savedTable);
    if (savedOrderId) setCurrentOrderId(savedOrderId); // เพิ่มบรรทัดนี้
  } catch (e) {
    console.error('Error loading cart:', e);
  }
}, []);

// เพิ่มฟังก์ชันใหม่ 2 ตัวนี้:

// โหลดออเดอร์ที่ยังไม่เสร็จ (กรณีลูกค้ากดสั่งแล้วแต่หน้าเว็บดับ/รีเฟรช)
const loadPendingOrder = async (orderId: string) => {
  try {
    const res = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    
    if (data.success && data.order) {
      // ถ้าออเดอร์ยังไม่ served หรือ paid ให้โหลดกลับมา
      if (['pending', 'confirmed', 'preparing'].includes(data.order.status)) {
        setCurrentOrderId(orderId);
        localStorage.setItem('brewmenu_currentOrderId', orderId);
        
        // แปลง order_items กลับเป็น cart items ถ้าต้องการ (optional)
        if (data.order.items && data.order.items.length > 0) {
          // ตรวจสอบว่าอยากให้เติมกลับเข้าตะกร้าด้วยไหม หรือแค่เก็บ reference ไว้
          console.log('Pending order loaded:', data.order);
        }
      } else {
        // ออเดอร์เสร็จแล้ว ล้าง reference
        localStorage.removeItem('brewmenu_currentOrderId');
        setCurrentOrderId(null);
      }
    }
  } catch (error) {
    console.error('Error loading pending order:', error);
  }
};

// Sync ตะกร้ากับ server (ใช้ตอนกลับมาที่หน้าเดิม)
const syncWithServer = async () => {
  if (!currentOrderId) return;
  
  await loadPendingOrder(currentOrderId);
};

// ใน clearCart เพิ่ม:
const clearCart = () => {
  setItems([]);
  setCurrentOrderId(null); // เพิ่มบรรทัดนี้
  try {
    localStorage.removeItem('brewmenu_cart');
    localStorage.removeItem('brewmenu_currentOrderId'); // เพิ่มบรรทัดนี้
  } catch (e) {
    console.error('Error clearing cart:', e);
  }
};

// อย่าลืมเพิ่มใน value ของ Provider:
<CartContext.Provider value={{
  items, 
  tableId, 
  currentOrderId, // เพิ่ม
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart, 
  setTableId, 
  loadPendingOrder, // เพิ่ม
  syncWithServer, // เพิ่ม
  total,
  itemCount,
  mounted
}}>
