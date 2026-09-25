import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const u = await getCurrentUser();

  if (!u) {
    redirect("/login");
  }

  if (u.role !== "ADMIN") {
    redirect("/login");
  }

  return children;
}