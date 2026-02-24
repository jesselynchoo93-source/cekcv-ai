const N8N_BASE_URL = process.env.N8N_BASE_URL!;

const N8N_HEADERS = {
  "ngrok-skip-browser-warning": "true",
};

export interface SubmitResponse {
  success: boolean;
  jobId?: string;
  batchId?: string;
  totalFiles?: number;
  status: string;
  message?: string;
}

export interface StatusResponse {
  success: boolean;
  jobId: string;
  batchId: string | null;
  type: "individual" | "company";
  status: "processing" | "complete" | "error";
  step: string;
  stepDescription: string;
  progress: number;
  candidateIndex: number;
  totalCandidates: number;
  createdAt: string;
  updatedAt: string;
  result: Record<string, unknown> | null;
  error: string | null;
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Expected JSON but got: ${text.slice(0, 200)}${text.length > 200 ? "..." : ""}`
    );
  }
}

export async function submitIndividual(formData: FormData): Promise<SubmitResponse> {
  const res = await fetch(`${N8N_BASE_URL}/webhook/308876b5-b973-42b3-8dc7-d3c3925a5665`, {
    method: "POST",
    headers: N8N_HEADERS,
    body: formData,
  });
  return parseJsonResponse(res);
}

export async function submitCompany(formData: FormData): Promise<SubmitResponse> {
  const res = await fetch(`${N8N_BASE_URL}/webhook/429f9dea-6f42-4918-9672-95ee3257a79a`, {
    method: "POST",
    headers: N8N_HEADERS,
    body: formData,
  });
  return parseJsonResponse(res);
}

export async function pollStatus(jobId: string): Promise<StatusResponse> {
  const res = await fetch(
    `${N8N_BASE_URL}/webhook/308876b5-b973-42b3-8dc7-d3c3925a5665`,
    {
      method: "POST",
      headers: { ...N8N_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check-status", jobId }),
    }
  );
  const data = await parseJsonResponse<StatusResponse | StatusResponse[]>(res);
  // n8n respondWith: "allIncomingItems" wraps in array
  return Array.isArray(data) ? data[0] : data;
}
