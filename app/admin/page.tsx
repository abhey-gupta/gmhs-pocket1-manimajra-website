// @ts-nocheck
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const token = cookies().get("admin_token");
  const secureToken = process.env.ADMIN_TOKEN;

  if (!token || !secureToken || token.value !== secureToken) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
};

export default Admin;
