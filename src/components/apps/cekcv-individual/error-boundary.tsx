"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export class ResultsErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode; onReset: () => void }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-10 text-center">
            <p className="text-lg font-medium text-destructive">Display Error</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The results were received but could not be displayed.
            </p>
            <pre className="mt-4 max-h-40 overflow-auto rounded bg-muted p-3 text-left text-xs">
              {this.state.error.message}
            </pre>
            <Button onClick={this.props.onReset} className="mt-6">Try Again</Button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
