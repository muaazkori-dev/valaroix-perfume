import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Central in-memory cloud database for live orders across all devices
let globalOrders = [];

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
    const data = await req.json();
    const { orderId, id, ...updates } = data;
    const targetId = orderId || id;

    let found = false;
    globalOrders = globalOrders.map((o) => {
      if (o.id === targetId) {
        found = true;
        return { ...o, ...updates };
      }
      return o;
    });

    if (!found && targetId) {
      globalOrders = [{ id: targetId, ...updates }, ...globalOrders];
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

export async function DELETE(req) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.clearAll) {
      globalOrders = [];
      return NextResponse.json(
        { success: true, orders: [] },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        }
      );
    }
    const { orderId } = body;
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
