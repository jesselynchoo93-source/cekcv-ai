import { NextRequest, NextResponse } from "next/server";
import { submitCompany } from "@/lib/n8n";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const result = await submitCompany(formData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Submission failed" },
      { status: 500 }
    );
  }
}
