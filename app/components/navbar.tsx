import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  dashboard : boolean
  profile : boolean
  project : boolean
}

export default function Navbar({dashboard, profile, project} : NavbarProps) {
  return (
    <nav className="flex justify-around items-center bg-white shadow-xs h-24">

      <Image alt="logo abricot" height={30} width={180} src="/Logo.png" />
      <ul className="flex gap-50">
        <Link href="/" className={`${dashboard ? "flex gap-4 items-center px-16 py-6 bg-[#0F0F0F] rounded-xl" : "flex gap-4 items-center px-16 py-6 rounded-xl"}`}>
            <Image alt="dashboard" height={20} width={30} src={`${dashboard ? "/group-black.svg" : "/Group.svg"}`} />
          <p className={`${dashboard ? "text-white text-lg" : "text-[#D3590B] text-lg"}`}>
            Tableau de bord
          </p>
        </Link>
        <Link href='/projects' className={`${project ? "flex gap-4 items-center px-16 py-6 bg-[#0F0F0F] rounded-xl" : "flex gap-4 items-center px-16 py-6 rounded-xl"}`}>
            <Image alt="projets" height={20} width={30} src={`${project ? "/Union-black.svg" : "/Union.svg"}`} />
          <p className={`${project ? "text-white text-lg" : "text-[#D3590B] text-lg"}`}> 
            Projets
          </p>
        </Link>
      </ul>

      <Link href="/profile" className={`${profile ? "bg-[#D3590B] text-white p-6 rounded-full" : "bg-[#FFE8D9] p-6 rounded-full"}`}>
        AD
      </Link>
    </nav>
  );
}
