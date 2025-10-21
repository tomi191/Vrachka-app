import { redirect } from "next/navigation";

export default function AdminRootPage() {
  // Redirect /admin to /admin/dashboard
  redirect("/admin/dashboard");
}
