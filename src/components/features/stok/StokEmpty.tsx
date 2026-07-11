"use client";

import { Package, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

interface StokEmptyProps {
  isFiltered?: boolean;
  onReset?: () => void;
  onAddNew?: () => void;
}

export function StokEmpty({ isFiltered, onReset, onAddNew }: StokEmptyProps) {
  if (isFiltered) {
    return (
      <div className="rounded-xl bg-white shadow-sm">
        <EmptyState
          icon={SearchX}
          title="Tidak ada hasil"
          description="Coba kata kunci lain atau reset filter"
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
        icon={Package}
        title="Belum ada stok seragam"
        description="Mulai dengan menambahkan seragam pertama ke dalam sistem"
        action={
          onAddNew && (
            <Button size="mobile" onClick={onAddNew}>
              Tambah Seragam
            </Button>
          )
        }
      />
    </div>
  );
}