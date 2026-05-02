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

  // 🔒 Replace with your real admin email
  if (user?.emailAddresses[0].emailAddress !== "YOUR_EMAIL@gmail.com") {
    redirect("/");
  }

  return <>{children}</>;
}