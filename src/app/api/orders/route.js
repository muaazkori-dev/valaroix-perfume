import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Central in-memory cloud database for live orders across all devices
let globalOrders = [
  {
    id: 'VLX-81416',
    customerName: 'JSJSJ',
    name: 'JSJSJ',
    phone: '03183931685',
    whatsapp: '03183931685',
    city: 'Other City',
    address: 'Mandi din Bahawalpur, Other City',
    item: 'VALAROIX DIOR SAUVAGE',
    size: '50ml',
    pricePkr: 2699,
    total: 2699,
    cogsPkr: 950,
    profitPkr: 1749,
    status: 'Pending Verification',
    paymentMethod: 'Advance Payment (SadaPay)',
    tcsTrackingNumber: '7780863721',
    date: new Date().toISOString().split('T')[0],
    time: '3:00 AM',
    items: [
      {
        id: 'valaroix-sauvage-imperial',
        name: 'VALAROIX DIOR SAUVAGE',
        quantity: 1,
        price: 2699,
        image: '/products/sauvage.jpg?v=2'
      }
    ]
  },
  {
    id: 'VLX-24705',
    customerName: 'WALEED',
    name: 'WALEED',
    phone: '03337155323',
    whatsapp: '03337155323',
    city: 'Other City',
    address: 'Hyee Muaaz Kya Hal ha, Other City',
    item: 'VALAROIX DIOR SAUVAGE',
    size: '50ml',
    pricePkr: 2699,
    total: 2699,
    cogsPkr: 950,
    profitPkr: 1749,
    status: 'Pending Confirmation',
    paymentMethod: 'Advance Payment (SadaPay)',
    tcsTrackingNumber: '7780863721',
    date: new Date().toISOString().split('T')[0],
    time: '2:47 AM',
    items: [
      {
        id: 'valaroix-sauvage-imperial',
        name: 'VALAROIX DIOR SAUVAGE',
        quantity: 1,
        price: 2699,
        image: '/products/sauvage.jpg?v=2'
      }
    ]
  },
  {
    id: 'VLX-12630',
    customerName: 'Ali Hamza',
    name: 'Ali Hamza',
    phone: '03337155323',
    whatsapp: '03337155323',
    city: 'Larkana',
    address: 'wahid chowk green road rehbar model school larkana',
    item: 'VALAROIX YSL Y',
    size: '50ml',
    pricePkr: 3300,
    total: 3300,
    cogsPkr: 1100,
    profitPkr: 2200,
    status: 'Confirmed & Dispatched via TCS',
    paymentMethod: 'Advance Payment (SadaPay)',
    tcsTrackingNumber: '7748291048',
    date: new Date().toISOString().split('T')[0],
    time: '1:15 AM',
    items: [
      {
        id: 'valaroix-ysl-y',
        name: 'VALAROIX YSL Y',
        quantity: 1,
        price: 3300,
        image: '/products/ysl.jpg?v=2'
      }
    ]
  }
];

export async function GET() {
  return NextResponse.json(
    { orders: globalOrders, count: globalOrders.length, timestamp: Date.now() },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
  );
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (data && (data.id || data.customerName)) {
      const orderId = data.id || `VLX-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder = {
        ...data,
        id: orderId,
        date: data.date || new Date().toISOString().split('T')[0],
        time: data.time || new Date().toLocaleTimeString()
      };

      const existingIndex = globalOrders.findIndex(o => o.id === orderId);
      if (existingIndex > -1) {
        globalOrders[existingIndex] = { ...globalOrders[existingIndex], ...newOrder };
      } else {
        globalOrders = [newOrder, ...globalOrders];
      }
    }

    return NextResponse.json(
      { success: true, orders: globalOrders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { orderId, status } = await req.json();
    globalOrders = globalOrders.map(o => o.id === orderId ? { ...o, status } : o);
    return NextResponse.json(
      { success: true, orders: globalOrders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { orderId } = await req.json();
    globalOrders = globalOrders.filter(o => o.id !== orderId);
    return NextResponse.json(
      { success: true, orders: globalOrders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
