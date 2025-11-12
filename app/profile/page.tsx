"use client";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { useUser } from "../userContext";

export default function Page() {
  const user = useUser();
  let firstName = "";
  let lastName = "";

  if (user?.name) {
    [firstName, lastName] = user?.name.split(" ");
  }

  return (
    <>
      <Navbar dashboard={false} project={false} profile={true} />
      <main className="px-40 py-12">
        <article className="bg-white border border-[#E5E7EB] px-16 py-8 rounded-xl">
          <h1 className="font-semibold text-xl">Mon compte</h1>
          <h2 className="text-lg text-[#6B7280]">{firstName + " " + lastName}</h2>
          <form className="flex flex-col gap-4 mt-10">
            <div className="flex flex-col gap-2">
              <label htmlFor="nom">Nom</label>
              <input id="nom" type="text" defaultValue={lastName} className="border border-[#E5E7EB] h-13 rounded pl-2 text-[#6B7280]" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="prenom">Prénom</label>
              <input id="prenom" type="text" defaultValue={firstName} className="border border-[#E5E7EB] h-13 rounded pl-2 text-[#6B7280]" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" defaultValue={user?.email} className="border border-[#E5E7EB] h-13 rounded pl-2 text-[#6B7280]" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Mot de passe</label>
              <input id="password" type="password" className="border border-[#E5E7EB] h-13 rounded pl-2 text-[#6B7280]" />
            </div>
            <button type="submit" className="bg-[#1F1F1F] text-lg text-white py-3 w-[18%] rounded-xl hover:opacity-80 mt-3 pl-2">
              Modifier les informations
            </button>
          </form>
        </article>
      </main>
      <Footer />
    </>
  );
}
