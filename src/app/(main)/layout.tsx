import { MainLayout } from "@/components/layout/MainLayout";

export default function GroupMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}