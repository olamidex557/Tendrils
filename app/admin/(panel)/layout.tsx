import { auth, currentUser } from "@clerk/nextjs/server";
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

  const user = await currentUser();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

  if (adminEmail && userEmail !== adminEmail) {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
