const N8N_BASE_URL = process.env.N8N_BASE_URL!;

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

export async function submitIndividual(formData: FormData): Promise<SubmitResponse> {
  const res = await fetch(`${N8N_BASE_URL}/webhook/308876b5-b973-42b3-8dc7-d3c3925a5665`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function submitCompany(formData: FormData): Promise<SubmitResponse> {
  const res = await fetch(`${N8N_BASE_URL}/webhook/429f9dea-6f42-4918-9672-95ee3257a79a`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function pollStatus(jobId: string): Promise<StatusResponse> {
  const res = await fetch(
    `${N8N_BASE_URL}/webhook/cekcv-status?jobId=${encodeURIComponent(jobId)}`
  );
  return res.json();
}
