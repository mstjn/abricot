"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Bienvenue sur ton Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:opacity-80"
      >
        Se déconnecter
      </button>
    </div>
  );
}
