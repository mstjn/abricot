"use client";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
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
      <Image alt="logo abricot" height={30} width={180} src="/Logo.png" />

      <nav className="flex gap-6">
        <Link
          href="/"
          className={`${
            dashboard
              ? "group text-white flex gap-4 items-center h-20 w-64 justify-center bg-[#0F0F0F] rounded-xl transition-all duration-300 ease-in-out"
              : "group flex gap-4 items-center h-20 w-64 justify-center rounded-xl text-[#D3590B] hover:bg-[#0F0F0F] hover:text-white transition-all duration-300 ease-in-out"
          }`}
        >
          <Image
            alt="dashboard"
            height={20}
            width={30}
            src={dashboard ? "/group-black.svg" : "/Group.svg"}
            className="group-hover:hidden transition-all duration-300 ease-in-out"
          />
          <Image
            alt="dashboard hover"
            height={20}
            width={30}
            src="/group-black.svg"
            className="hidden group-hover:block transition-all duration-300 ease-in-out"
          />

          <p className="text-lg transition-all duration-300 ease-in-out">Tableau de bord</p>
        </Link>

        <Link
          href="/projects"
          className={`${
            project
              ? "group text-white flex gap-4 items-center h-20 w-64 justify-center bg-[#0F0F0F] rounded-xl transition-all duration-300 ease-in-out"
              : "group text-[#D3590B] flex gap-4 items-center h-20 w-64 justify-center rounded-xl hover:bg-[#0F0F0F] hover:text-white transition-all duration-300 ease-in-out"
          }`}
        >
          <Image
            alt="projets"
            height={20}
            width={30}
            src={project ? "/Union-black.svg" : "/Union.svg"}
            className="group-hover:hidden transition-all duration-300 ease-in-out"
          />
          <Image
            alt="projets hover"
            height={20}
            width={30}
            src="/Union-black.svg"
            className="hidden group-hover:block transition-all duration-300 ease-in-out"
          />

          <p className="text-lg transition-all duration-300 ease-in-out">Projets</p>
        </Link>
      </nav>
  <LogoutButton />
      <Link
        href="/profile"
        className={`${
          profile
            ? "bg-[#D3590B] text-white h-18 w-18 flex justify-center items-center rounded-full transition-all duration-300 ease-in-out"
            : "bg-[#FFE8D9] h-18 w-18 flex justify-center items-center rounded-full hover:bg-[#D3590B] hover:text-white transition-all duration-300 ease-in-out"
        }`}
      >
        {A + B}
      </Link>
    </header>
  );
}
