import Link from "next/link";
import { CekCVCompany } from "@/components/apps/cekcv-company";

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              CekCV.Ai
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Company Screening</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <CekCVCompany />
      </main>
    </div>
  );
}
