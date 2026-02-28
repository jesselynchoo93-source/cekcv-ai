import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const expected = process.env.DEMO_PASSCODE;

    if (!expected) {
      // No passcode configured = demo mode not enforced server-side
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: passcode === expected });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
