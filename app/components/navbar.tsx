"use client";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../userContext";

interface NavbarProps {
  dashboard: boolean;
  profile: boolean;
  project: boolean;
}

export default function Navbar({ dashboard, profile, project }: NavbarProps) {

  const user = useUser();
  let firstName = "";
  let lastName = "";
  if (user?.name) {
    [firstName, lastName] = user?.name.split(" ");
  }
  const A = firstName[0];
  const B = lastName[0];

  return (
    <header className="flex justify-around items-center bg-white shadow-xs h-24">
  <Image
    alt="logo abricot"
    height={30}
    width={180}
    className="hidden md:block"
    src="/Logo.png"
  />

  <nav
    className="flex md:gap-6 gap-10"
    role="navigation"
    aria-label="Navigation principale"
  >
    <Link
      href="/"
      aria-current={dashboard ? "page" : undefined}
      className={`${
        dashboard
          ? "group text-white flex gap-4 items-center md:h-20 md:w-64 justify-center bg-[#0F0F0F] rounded-xl md:p-0 p-5 transition-all duration-300 ease-in-out"
          : "group flex gap-4 items-center md:h-20 md:w-64 justify-center rounded-xl text-[#D3590B] hover:bg-[#0F0F0F] md:p-0 p-5 hover:text-white transition-all duration-300 ease-in-out"
      }`}
      aria-label="Accéder au tableau de bord"
    >
      <Image
        alt=""
        height={20}
        width={30}
        src={dashboard ? "/group-black.svg" : "/Group.svg"}
        aria-hidden="true"
        className="group-hover:hidden transition-all duration-300 ease-in-out"
      />
      <Image
        alt=""
        height={20}
        width={30}
        src="/group-black.svg"
        aria-hidden="true"
        className="hidden group-hover:block transition-all duration-300 ease-in-out"
      />

      <p className="text-lg transition-all duration-300 ease-in-out hidden md:block">
        Tableau de bord
      </p>
    </Link>

    <Link
      href="/projects"
      aria-current={project ? "page" : undefined}
      className={`${
        project
          ? "group text-white flex gap-4 items-center md:h-20 md:w-64 justify-center bg-[#0F0F0F] p-5 md:p-0 rounded-xl transition-all duration-300 ease-in-out"
          : "group text-[#D3590B] flex gap-4 items-center md:h-20 md:w-64 justify-center rounded-xl p-5 md:p-0 hover:bg-[#0F0F0F] hover:text-white transition-all duration-300 ease-in-out"
      }`}
      aria-label="Voir les projets"
    >
      <Image
        alt=""
        height={20}
        width={30}
        src={project ? "/Union-black.svg" : "/Union.svg"}
        aria-hidden="true"
        className="group-hover:hidden transition-all duration-300 ease-in-out"
      />
      <Image
        alt=""
        height={20}
        width={30}
        src="/Union-black.svg"
        aria-hidden="true"
        className="hidden group-hover:block transition-all duration-300 ease-in-out"
      />

      <p className="text-lg transition-all duration-300 ease-in-out hidden md:block">
        Projets
      </p>
    </Link>

    <Link
      href="/profile"
      aria-current={profile ? "page" : undefined}
      aria-label="Profil utilisateur"
      className={`${
        profile
          ? "bg-[#D3590B] text-white h-18 w-18 justify-center items-center rounded-full transition-all duration-300 ease-in-out flex md:hidden"
          : "bg-[#FFE8D9] h-18 w-18 justify-center items-center rounded-full hover:bg-[#D3590B] hover:text-white transition-all md:hidden flex duration-300 ease-in-out"
      }`}
    >
      {A + B}
    </Link>
  </nav>

  <Link
    href="/profile"
    aria-current={profile ? "page" : undefined}
    aria-label="Profil utilisateur"
    className={`${
      profile
        ? "bg-[#D3590B] text-white h-18 w-18 justify-center items-center rounded-full transition-all duration-300 ease-in-out hidden md:flex"
        : "bg-[#FFE8D9] h-18 w-18 justify-center items-center rounded-full hover:bg-[#D3590B] hover:text-white transition-all hidden md:flex duration-300 ease-in-out"
    }`}
  >
    {A + B}
  </Link>
</header>

  );
}
