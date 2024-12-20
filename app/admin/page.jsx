import AddAnnouncement from "@/components/admin/AddAnnouncement";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AddActivity from "@/components/admin/AddActivity";

const Admin = () => {
  const token = cookies().get("admin_token");
  if (!token || token.value !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[50vh] pt-24 px-16">
      <h1 className="text-center font-semibold text-2xl">Admin Portal</h1>

      <div className="grid grid-cols-2 gap-3 mt-5 mx-auto md:w-1/2 md:grid-cols-3">
        <AddAnnouncement />
        <AddActivity />
      </div>
    </div>
  );
};

export default Admin;
