import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { workflows } from "@/config/workflows";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight">CekCV.Ai</h1>
          <p className="mt-2 text-muted-foreground">
            AI-powered CV analysis and candidate screening
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="mb-6 text-xl font-semibold">Available Apps</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {workflows.map((wf) => (
            <Link key={wf.slug} href={`/apps/${wf.slug}`}>
              <Card className="h-full transition-colors hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{wf.name}</CardTitle>
                    <Badge variant={wf.type === "individual" ? "default" : "secondary"}>
                      {wf.type}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">
                    {wf.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
