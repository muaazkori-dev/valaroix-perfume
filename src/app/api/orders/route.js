import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL = 'https://xarwwlbbaevclyljkvzt.supabase.co/rest/v1';
const SUPABASE_KEY = 'sb_publishable_v3-WUAhugqCtckYHXxcQNg_H-mBrrC4';

const supabaseHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

// In-memory cache fallback for high speed
let memoryOrders = [];

// Helper to format an order consistently
function formatOrder(data) {
  const orderId = data.id || data.orderId || `VLX-${Math.floor(10000 + Math.random() * 90000)}`;
  return {
    id: orderId,
    orderId: orderId,
    customerName: data.customerName || data.name || data.customer_name || 'Customer',
    phone: data.phone || data.whatsapp || data.customer_phone || '',
    whatsapp: data.whatsapp || data.phone || data.customer_phone || '',
    address: data.address || data.customer_address || '',
    city: data.city || 'Pakistan',
    item: data.item || data.perfume || 'VALAROIX Parfum',
    items: data.items || [],
    total: Math.ceil(Number(data.total || data.pricePkr || data.total_amount || 3000) / 100) * 100,
    pricePkr: Math.ceil(Number(data.pricePkr || data.total || data.total_amount || 3000) / 100) * 100,
    status: data.status || 'Pending Verification',
    paymentMethod: data.paymentMethod || data.payment_method || 'COD',
    tcsTrackingNumber: data.tcsTrackingNumber || data.tcs_cn || null,
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    source: data.source || 'valaroix',
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const q = searchParams.get('q');

    // Fetch from Supabase
    let fetchedOrders = [];
    try {
      const sbRes = await fetch(
        `${SUPABASE_URL}/orders?select=*&order=created_at.desc&limit=60`,
        { headers: supabaseHeaders, cache: 'no-store' }
      );
      if (sbRes.ok) {
        const rawList = await sbRes.json();
        for (const row of rawList) {
          // Check if this is a Valaroix order (notes contains VALAROIX or metadata)
          if (row.notes && row.notes.includes('VALAROIX')) {
            try {
              const meta = JSON.parse(row.notes.replace('VALAROIX::', ''));
              fetchedOrders.push({
                id: meta.orderId || `VLX-${row.id}`,
                orderId: meta.orderId || `VLX-${row.id}`,
                customerName: row.customer_name || 'Customer',
                phone: row.customer_phone || '',
                whatsapp: row.customer_phone || '',
                address: meta.address || row.customer_address || '',
                city: meta.city || 'Pakistan',
                item: meta.item || 'VALAROIX Parfum',
                items: meta.items || [],
                total: Math.ceil(Number(row.total_amount || 3000) / 100) * 100,
                pricePkr: Math.ceil(Number(row.total_amount || 3000) / 100) * 100,
                status: row.status || 'Pending Verification',
                tcsTrackingNumber: meta.tcsTrackingNumber || null,
                createdAt: row.created_at || new Date().toISOString(),
                source: 'valaroix',
                sbId: row.id,
              });
            } catch (_) {}
          }
        }
      }
    } catch (_) {}

    // Merge Supabase orders with in-memory orders (deduplicated by ID)
    const orderMap = new Map();
    for (const o of memoryOrders) {
      orderMap.set(o.id, o);
    }
    for (const o of fetchedOrders) {
      if (!orderMap.has(o.id)) {
        orderMap.set(o.id, o);
      }
    }

    let combined = Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Apply phone or tracking query filter if requested
    if (phone) {
      combined = combined.filter((o) => o.phone.includes(phone) || phone.includes(o.phone));
    }
    if (q) {
      const query = q.toLowerCase();
      combined = combined.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          (o.tcsTrackingNumber && o.tcsTrackingNumber.toLowerCase().includes(query)) ||
          o.phone.includes(query)
      );
    }

    return NextResponse.json(
      { success: true, orders: combined, count: combined.length, timestamp: Date.now() },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ success: true, orders: memoryOrders }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const formatted = formatOrder(data);

    // 1. Save in memory cache immediately
    const existingIdx = memoryOrders.findIndex((o) => o.id === formatted.id);
    if (existingIdx > -1) {
      memoryOrders[existingIdx] = formatted;
    } else {
      memoryOrders = [formatted, ...memoryOrders];
    }

    // 2. Persist to Supabase in the background
    try {
      const meta = {
        orderId: formatted.id,
        item: formatted.item,
        items: formatted.items,
        address: formatted.address,
        city: formatted.city,
        tcsTrackingNumber: formatted.tcsTrackingNumber,
        source: 'valaroix',
      };

      await fetch(`${SUPABASE_URL}/orders`, {
        method: 'POST',
        headers: {
          ...supabaseHeaders,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          customer_name: formatted.customerName,
          customer_phone: formatted.phone,
          customer_address: `${formatted.address}, ${formatted.city}`,
          total_amount: formatted.total,
          payment_method: formatted.paymentMethod || 'COD',
          status: formatted.status || 'Pending Verification',
          notes: `VALAROIX::${JSON.stringify(meta)}`,
        }),
      });
    } catch (_) {}

    return NextResponse.json(
      { success: true, order: formatted, orders: memoryOrders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const data = await req.json();
    const targetId = data.orderId || data.id;

    memoryOrders = memoryOrders.map((o) => {
      if (o.id === targetId) {
        return { ...o, ...data };
      }
      return o;
    });

    // Update in Supabase
    try {
      if (targetId) {
        const patchBody = {};
        if (data.status) patchBody.status = data.status;

        const sbRes = await fetch(`${SUPABASE_URL}/orders?notes=ilike.*${targetId}*&select=*`, {
          headers: supabaseHeaders,
        });
        if (sbRes.ok) {
          const rows = await sbRes.json();
          if (rows.length > 0) {
            const row = rows[0];
            let meta = {};
            try {
              meta = JSON.parse(row.notes.replace('VALAROIX::', ''));
            } catch (_) {}
            if (data.tcsTrackingNumber) meta.tcsTrackingNumber = data.tcsTrackingNumber;
            if (data.status) meta.status = data.status;
            patchBody.notes = `VALAROIX::${JSON.stringify(meta)}`;

            await fetch(`${SUPABASE_URL}/orders?id=eq.${row.id}`, {
              method: 'PATCH',
              headers: supabaseHeaders,
              body: JSON.stringify(patchBody),
            });
          }
        }
      }
    } catch (_) {}

    return NextResponse.json(
      { success: true, orders: memoryOrders },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const data = await req.json().catch(() => ({}));
    if (data.clearAll) {
      memoryOrders = [];
      return NextResponse.json({ success: true, orders: [] });
    }
    const targetId = data.orderId || data.id;
    memoryOrders = memoryOrders.filter((o) => o.id !== targetId);
    return NextResponse.json({ success: true, orders: memoryOrders });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
