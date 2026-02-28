"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Lock, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const SESSION_KEY = "cekcv_demo_unlocked";

function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

/**
 * Returns whether demo mode is active and not yet unlocked.
 * Use `useDemoGate()` in form components to guard submissions.
 */
export function useDemoGate() {
  const [showDialog, setShowDialog] = useState(false);
  const [unlocked, setUnlocked] = useState(() => !DEMO_MODE || isUnlocked());

  const guardSubmit = useCallback(
    (onSubmit: (e: React.FormEvent) => void) => {
      return (e: React.FormEvent) => {
        if (!DEMO_MODE || isUnlocked()) {
          onSubmit(e);
          return;
        }
        e.preventDefault();
        setShowDialog(true);
      };
    },
    []
  );

  const onUnlock = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setUnlocked(true);
    setShowDialog(false);
  }, []);

  return { isDemoMode: DEMO_MODE, unlocked, showDialog, setShowDialog, guardSubmit, onUnlock };
}

export function DemoGateDialog({
  open,
  onOpenChange,
  onUnlock,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUnlock: () => void;
}) {
  const { locale } = useLanguage();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        onUnlock();
      } else {
        setError(locale === "en" ? "Invalid access code" : "Kode akses tidak valid");
      }
    } catch {
      setError(locale === "en" ? "Verification failed" : "Verifikasi gagal");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-center">
            {locale === "en" ? "Demo Mode" : "Mode Demo"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {locale === "en"
              ? "Submissions are disabled in demo mode. This site is for preview purposes only — no CV analysis will be processed."
              : "Pengiriman dinonaktifkan dalam mode demo. Situs ini hanya untuk pratinjau — tidak ada analisis CV yang akan diproses."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/20 dark:text-amber-300">
          {locale === "en"
            ? "If you have an access code, enter it below to unlock submissions."
            : "Jika Anda memiliki kode akses, masukkan di bawah untuk membuka pengiriman."}
        </div>

        <div className="mt-4 space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder={locale === "en" ? "Enter access code" : "Masukkan kode akses"}
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleVerify(); }}
              className="pl-9"
              autoFocus
            />
          </div>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <Button
            onClick={handleVerify}
            disabled={!code.trim() || verifying}
            className="w-full cekcv-gradient text-white"
          >
            {verifying ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{locale === "en" ? "Verifying..." : "Memverifikasi..."}</>
            ) : (
              locale === "en" ? "Unlock" : "Buka Kunci"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
