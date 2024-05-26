import AddAnnouncement from "@/components/admin/AddAnnouncement";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const Admin = () => {
  const token = cookies().get("admin_token");
  if (!token || token.value !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[50vh] pt-24 px-16">
      <h1 className="text-center font-semibold text-2xl">Admin Portal</h1>
      <AddAnnouncement />
    </div>
  );
};

export default Admin;
