import { cookies } from "next/headers";

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token");
  const secureToken = process.env.ADMIN_TOKEN;
  
  if (!secureToken) {
    console.warn("ADMIN_TOKEN is not defined in environment variables.");
    return false;
  }
  
  return !!token && token.value === secureToken;
}
