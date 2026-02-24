"use client";

import { useCallback, useState } from "react";

export function useChecklist(totalCount: number, storageKey?: string) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) return new Set(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    return new Set();
  });

  const toggleItem = useCallback((index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      if (storageKey && typeof window !== "undefined") {
        sessionStorage.setItem(storageKey, JSON.stringify([...next]));
      }
      return next;
    });
  }, [storageKey]);

  const checkedCount = checkedItems.size;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return { checkedItems, toggleItem, checkedCount, totalCount, progress };
}
