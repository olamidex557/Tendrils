import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/admin/sign-in");
  }

  return <AdminShell>{children}</AdminShell>;
}
