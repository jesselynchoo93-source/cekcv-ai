import { NextRequest, NextResponse } from "next/server";
import { searchJobs } from "@/lib/n8n";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "jobId is required" },
        { status: 400 }
      );
    }

    const result = await searchJobs(jobId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Job search failed" },
      { status: 500 }
    );
  }
}
