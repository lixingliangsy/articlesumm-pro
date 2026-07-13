import { NextRequest, NextResponse } from 'next/server';

// Note
const TEST_MODE = !process.env.WAFFO_MERCHANT_ID || !process.env.WAFFO_PRIVATE_KEY;

export async function POST(request: NextRequest) {
  try {
    const { productId, email } = await request.json();
    
    if (TEST_MODE) {
      console.log('⚠️ Waffo env vars not configured, using test mode');
      return NextResponse.json({
        sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?test=true&product=${productId}`
      });
    }
    
    // Note
    // const client = new WaffoPancake({
    //   merchantId: process.env.WAFFO_MERCHANT_ID!,
    //   privateKey: process.env.WAFFO_PRIVATE_KEY!,
    // });
    // const session = await client.checkout.createSession({...});
    
    return NextResponse.json({
      sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
