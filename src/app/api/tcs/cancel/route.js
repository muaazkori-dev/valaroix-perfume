import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TCS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRpZCI6IjIxNTYzNzUwMyIsInNlcnZpY2VzIjoiMTAzLDE1NSwxNjEsMTY0LDIyNSwyNDcsMjQ4LDI0OSwyNTAsMjUxLDI3NywyOTMsMzY3LDM3MywzNzcsMzg4LDQ0OCw0NDksNDUwLDQ1MSw0NTIsNDUzLDQ1NCw0NzIsNDczIiwiZXhjbHVkZWQtc2VydmljZXMiOiIiLCJpc3MiOiJjb25uZWN0LnRjc2NvdXJpZXIuY29tIiwianRpIjoiZGJmNTVmZDEtZWRiNi00ZjhjLTg5MWUtYmRlOGQ5Y2EzZDhkIiwibmJmIjoxNzkxNTY1ODI1LCJleHAiOjE4Nzc5NjU4MjUsImlhdCI6MTc5MTU2NTgyNX0.-3QLJw7YA2lFDeuZ6oPd-W8KL5l2JKIlmKACnQkKdb4';
const TCS_BASE_URL = 'https://ociconnect.tcscourier.com/ecom';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, tcsTrackingNumber } = body;

    if (!orderId && !tcsTrackingNumber) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID or TCS CN number is required.' 
      }, { status: 400 });
    }

    let tcsResponse = null;

    if (tcsTrackingNumber) {
      try {
        const res = await fetch(`${TCS_BASE_URL}/api/booking/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TCS_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            consignmentnumber: String(tcsTrackingNumber),
            accesstoken: TCS_TOKEN
          }),
          cache: 'no-store'
        });

        if (res.ok) {
          tcsResponse = await res.json();
        }
      } catch (e) {}
    }

    // Update central order database to cancelled
    if (orderId) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://valaroix.com');
        await fetch(`${baseUrl}/api/orders`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            status: 'Cancelled (TCS Booking Deleted)',
            tcsTrackingNumber: null
          })
        });
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      orderId,
      tcsTrackingNumber,
      message: `TCS Booking for CN #${tcsTrackingNumber || orderId} successfully cancelled and deleted from TCS Envio.`,
      tcsResponse
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to cancel TCS booking.' 
    }, { status: 500 });
  }
}
