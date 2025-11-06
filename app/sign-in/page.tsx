import Image from "next/image";
import Link from "next/link";

export default function page() {
  return (
    <div>
      <div className="bg-[#F9FAFB] w-[35%] h-screen flex flex-col items-center justify-between py-20">
        <Image alt="" height={100} width={250} src="/Logo.png" />

        <div className="w-full flex flex-col items-center gap-10">
          <h1 className="text-[#D3590B] font-bold text-4xl">Inscription</h1>
          <form action="" className="flex flex-col w-[50%] gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="mail" className="text-sm">Email</label>
              <input type="email" id="mail" className="bg-white border border-[#E5E7EB] h-12 px-2" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm">Mot de passe</label>
              <input type="password" id="password" className="bg-white border border-[#E5E7EB] h-12 px-2" />
            </div>

            <button className="bg-[#1F1F1F] text-lg text-white rounded-xl h-12 w-[85%] self-center hover:opacity-80">S&apos;inscrire</button>
            <u className="text-[#F9FAFB] text-sm self-center">.</u>
          </form>
        </div>

        <p className="text-sm">
          Déjà inscrit ? <u className="text-[#D3590B]"><Link href="/login">Se connecter</Link></u>
        </p>
      </div>

      <Image alt="" fill className="-z-10 object-cover" src="/signin.jpg" />
    </div>
  );
}
