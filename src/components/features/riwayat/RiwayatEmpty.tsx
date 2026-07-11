"use client";

import { ClipboardList, SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

interface RiwayatEmptyProps {
  isFiltered?: boolean;
  onReset?: () => void;
}

export function RiwayatEmpty({ isFiltered, onReset }: RiwayatEmptyProps) {
  if (isFiltered) {
    return (
      <div className="rounded-xl bg-white shadow-sm">
        <EmptyState
          icon={SearchX}
          title="Tidak ada hasil"
          description="Coba kata kunci lain atau ubah filter"
          action={
            onReset && (
              <Button variant="outline" size="sm" onClick={onReset}>
                Reset Filter
              </Button>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <EmptyState
        icon={ClipboardList}
        title="Belum ada riwayat"
        description="Semua pengambilan seragam akan muncul di sini"
        action={
          <Button size="mobile" render={<Link href={ROUTES.CATAT} />}>
            Catat Pengambilan Pertama
          </Button>
        }
      />
    </div>
  );
}