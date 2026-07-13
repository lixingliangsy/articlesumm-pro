import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Integrate Waffo Pancake payment
  // For now, return a placeholder URL
  return NextResponse.json({ 
    url: "https://example.com/checkout-placeholder" 
  });
}

export const dynamic = "force-dynamic";
