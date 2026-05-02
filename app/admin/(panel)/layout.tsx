import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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

  const adminUsername = "Tendrils";

  if (user?.username !== adminUsername) {
    redirect("/");
  }

  return <>{children}</>;
}