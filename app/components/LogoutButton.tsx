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
      className="text-lg text-white bg-red-600 py-3 w-40 rounded-xl hover:opacity-80 mt-3 pl-2"
    >
      Se déconnecter
    </button>
  );
}
