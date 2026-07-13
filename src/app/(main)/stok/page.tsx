"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EditStokForm } from "@/components/features/stok/EditStokForm";
import { FilterStok } from "@/components/features/stok/FilterStok";
import { StokEmpty } from "@/components/features/stok/StokEmpty";
import { StokList } from "@/components/features/stok/StokList";
import { StokSkeleton } from "@/components/features/stok/StokSkeleton";
import { TambahStokForm } from "@/components/features/stok/TambahStokForm";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useUniformTypes } from "@/hooks/useJenis";
import {
  useDeleteStockItem,
  useStokGrouped,
  useUpdateStockItem,
  useUpsertStock,
} from "@/hooks/useStok";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
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

  const [tambahOpen, setTambahOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState<JenisSeragam | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  const { data: grouped, isLoading, error, refetch } = useStokGrouped();
  const { data: categories } = useCategories();
  const { data: allJenis } = useUniformTypes();

  const upsertMutation = useUpsertStock();
  const updateMutation = useUpdateStockItem();
  const deleteMutation = useDeleteStockItem();

  const filteredGrouped = useMemo(() => {
    if (!grouped) return [];

    let result = grouped;

    if (stokKategoriId) {
      result = result.filter((g) => g.kategori.id === stokKategoriId);
    }

    if (stokSearch.trim()) {
      const q = stokSearch.trim().toLowerCase();
      result = result
        .map((g) => ({
          ...g,
          jenisList: g.jenisList
            .map((j) => ({
              ...j,
              items: j.items.filter(
                (item) =>
                  j.jenis.nama.toLowerCase().includes(q) ||
                  item.ukuran.toLowerCase().includes(q) ||
                  g.kategori.nama.toLowerCase().includes(q)
              ),
            }))
            .filter((j) => j.items.length > 0),
        }))
        .filter((g) => g.jenisList.length > 0);
    }

    return result;
  }, [grouped, stokKategoriId, stokSearch]);

  const isFiltered = stokSearch.trim().length > 0 || stokKategoriId !== null;

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
    jenisId: string;
    ukuran: string;
    jumlah: number;
    harga?: number;
  }) => {
    try {
      const result = await upsertMutation.mutateAsync({
        uniform_type: values.jenisId,
        ukuran: values.ukuran,
        stok: values.jumlah,
        stok_awal: values.jumlah,
        harga: values.harga,
      });

      const jenis = allJenis?.find((j) => j.id === values.jenisId);
      const jenisNama = jenis?.nama || "Seragam";

      if (result.action === "created") {
        toast.success("✓ Stok baru berhasil dibuat", {
          description: `${jenisNama} — ${result.ukuran} · ${values.jumlah} unit`,
        });
      } else {
        toast.success("✓ Stok berhasil ditambahkan", {
          description: `${jenisNama} — ${result.ukuran}: ${result.stokSebelum} + ${values.jumlah} = ${result.stokSesudah} unit`,
        });
      }

      setTambahOpen(false);
    } catch (err) {
      toast.error("Gagal menambah stok", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleEditSubmit = async (values: {
    ukuran: string;
    stok: number;
    harga?: number;
  }) => {
    if (!selectedItem) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedItem.id,
        input: values,
      });

      toast.success("✓ Perubahan berhasil disimpan");
      setEditOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan perubahan", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleDelete = async (item: StockItem) => {
    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success("✓ Ukuran berhasil dihapus");
      setEditOpen(false);
    } catch (err) {
      toast.error("Gagal menghapus ukuran", {
        description: parsePocketBaseError(err),
      });
    }
  };

  return (
    <>
      <TopAppBar
        title="Stok Seragam"
        rightSlot={
          <Button
            size="sm"
            onClick={handleAddStokNew}
            className="gap-1"
            disabled={!allJenis || allJenis.length === 0}
          >
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        }
      />

      <div className="space-y-4 px-4 py-4">
        <FilterStok
          kategoris={categories ?? []}
          searchValue={stokSearch}
          onSearchChange={setStokSearch}
          kategoriId={stokKategoriId}
          onKategoriChange={setStokKategoriId}
        />

        {isLoading ? (
          <StokSkeleton />
        ) : error ? (
          <ErrorState
            description={parsePocketBaseError(error)}
            onRetry={() => refetch()}
          />
        ) : filteredGrouped.length === 0 ? (
          <StokEmpty
            isFiltered={isFiltered}
            onReset={resetStokFilter}
            onAddNew={handleAddStokNew}
          />
        ) : (
          <StokList
            grouped={filteredGrouped}
            threshold={threshold}
            onAddStok={handleAddStokForJenis}
            onItemClick={handleItemClick}
          />
        )}
      </div>

      <TambahStokForm
        open={tambahOpen}
        onOpenChange={setTambahOpen}
        jenis={selectedJenis}
        jenisList={allJenis ?? []}
        onSubmit={handleTambahSubmit}
        isLoading={upsertMutation.isPending}
      />

      <EditStokForm
        open={editOpen}
        onOpenChange={setEditOpen}
        item={selectedItem}
        onSubmit={handleEditSubmit}
        onDelete={handleDelete}
        isLoading={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}