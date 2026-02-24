import Link from "next/link";
import { CekCVIndividual } from "@/components/apps/cekcv-individual";
import { ThemeToggle } from "@/components/apps/cekcv-individual/ui/theme-toggle";

export default function IndividualPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                CekCV.Ai
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium">Individual Analysis</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <CekCVIndividual />
      </main>
    </div>
  );
}
