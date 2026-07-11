"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditStokForm } from "@/components/features/stok/EditStokForm";
import { FilterStok } from "@/components/features/stok/FilterStok";
import { StokEmpty } from "@/components/features/stok/StokEmpty";
import { StokList } from "@/components/features/stok/StokList";
import { StokSkeleton } from "@/components/features/stok/StokSkeleton";
import { TambahStokForm } from "@/components/features/stok/TambahStokForm";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { filterMockStokGrouped, mockKategoris } from "@/lib/mock-data";
import { useFilterStore } from "@/stores/filterStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { JenisSeragam, StockItem } from "@/types";

export default function StokPage() {
  const {
    stokSearch,
    stokKategoriId,
    setStokSearch,
    setStokKategoriId,
    resetStokFilter,
  } = useFilterStore();

  const threshold = useSettingsStore((state) => state.thresholdMenipis);

  // Modal states
  const [tambahOpen, setTambahOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState<JenisSeragam | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // TODO: Ganti dengan hooks dari PocketBase di fase nanti
  const isLoading = false;
  const grouped = filterMockStokGrouped(stokSearch, stokKategoriId);
  const isFiltered = stokSearch.trim().length > 0 || stokKategoriId !== null;

  // Handlers
  const handleAddStokForJenis = (jenis: JenisSeragam) => {
    setSelectedJenis(jenis);
    setTambahOpen(true);
  };

  const handleAddStokNew = () => {
    setSelectedJenis(null);
    setTambahOpen(true);
  };

  const handleItemClick = (item: StockItem) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const handleTambahSubmit = async (values: {
    ukuran: string;
    jumlah: number;
    harga?: number;
  }) => {
    // TODO: integrasi dengan PocketBase
    console.log("Tambah stok:", { jenis: selectedJenis, ...values });
    toast.success("✓ Stok berhasil ditambahkan", {
      description: `${selectedJenis?.nama || "Seragam"} — ${values.ukuran} · ${values.jumlah} unit`,
    });
    setTambahOpen(false);
  };

  const handleEditSubmit = async (values: {
    ukuran: string;
    stok: number;
    harga?: number;
  }) => {
    // TODO: integrasi dengan PocketBase
    console.log("Edit stok:", { item: selectedItem, ...values });
    toast.success("✓ Perubahan berhasil disimpan");
    setEditOpen(false);
  };

  const handleDelete = async (item: StockItem) => {
    // TODO: integrasi dengan PocketBase
    console.log("Hapus item:", item);
    toast.success("✓ Ukuran berhasil dihapus");
    setEditOpen(false);
  };

  return (
    <>
      <TopAppBar
        title="Stok Seragam"
        rightSlot={
          <Button size="sm" onClick={handleAddStokNew} className="gap-1">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        }
      />

      <div className="space-y-4 px-4 py-4">
        {/* Filter section */}
        <FilterStok
          kategoris={mockKategoris}
          searchValue={stokSearch}
          onSearchChange={setStokSearch}
          kategoriId={stokKategoriId}
          onKategoriChange={setStokKategoriId}
        />

        {/* Content */}
        {isLoading ? (
          <StokSkeleton />
        ) : grouped.length === 0 ? (
          <StokEmpty
            isFiltered={isFiltered}
            onReset={resetStokFilter}
            onAddNew={handleAddStokNew}
          />
        ) : (
          <StokList
            grouped={grouped}
            threshold={threshold}
            onAddStok={handleAddStokForJenis}
            onItemClick={handleItemClick}
          />
        )}
      </div>

      {/* Modals */}
      <TambahStokForm
        open={tambahOpen}
        onOpenChange={setTambahOpen}
        jenis={selectedJenis}
        onSubmit={handleTambahSubmit}
      />

      <EditStokForm
        open={editOpen}
        onOpenChange={setEditOpen}
        item={selectedItem}
        onSubmit={handleEditSubmit}
        onDelete={handleDelete}
      />
    </>
  );
}