export interface WorkflowConfig {
  name: string;
  slug: string;
  description: string;
  webhookPath: string;
  statusPath: string;
  type: "individual" | "company";
}

export const workflows: WorkflowConfig[] = [
  {
    name: "CekCV Individual",
    slug: "cekcv-individual",
    description:
      "Upload your CV and job description to get AI-powered scoring, improvement advice, and job recommendations.",
    webhookPath: "/webhook/308876b5-b973-42b3-8dc7-d3c3925a5665",
    statusPath: "/webhook/cekcv-poll-status",
    type: "individual",
  },
  {
    name: "CekCV Company",
    slug: "cekcv-company",
    description:
      "Upload multiple CVs to score and rank candidates against a job role using 3 AI models.",
    webhookPath: "/webhook/429f9dea-6f42-4918-9672-95ee3257a79a",
    statusPath: "/webhook/cekcv-poll-status",
    type: "company",
  },
];

export function getWorkflow(slug: string): WorkflowConfig | undefined {
  return workflows.find((w) => w.slug === slug);
}
