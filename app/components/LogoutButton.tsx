"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {        
    Cookies.remove("token")
    router.push("/login")
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:opacity-80"
    >
      Se déconnecter
    </button>
  );
}
