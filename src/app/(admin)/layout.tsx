import { AdminLayout } from "@/components/layout/AdminLayout";

export default function GroupAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}