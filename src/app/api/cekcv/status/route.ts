import { NextRequest, NextResponse } from "next/server";
import { pollStatus } from "@/lib/n8n";

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json(
      { success: false, error: "jobId is required" },
      { status: 400 }
    );
  }

  try {
    const result = await pollStatus(jobId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Status check failed" },
      { status: 500 }
    );
  }
}
