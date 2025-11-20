"use client";
import { useState } from "react";
import Footer from "../components/footer";
import LogoutButton from "../components/LogoutButton";
import Navbar from "../components/navbar";
import { useUser } from "../userContext";

export default function Page() {
  const user = useUser();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  let firstName = "";
  let lastName = "";

  if (user?.name) {
    [firstName, lastName] = user?.name.split(" ");
  }


  function validatePassword(pw : string) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pw);
  }
  
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); 

  const form = e.currentTarget;
  const formData = new FormData(form);

  const newPassword = formData.get("password") as string;
  if (newPassword && !validatePassword(newPassword)) {
    setPasswordError("Le mot de passe doit contenir au minimum 8 caractères, une majuscule et un chiffre.");
    return;
  }

  const res = await fetch("/api/edit", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.type === "password") {
      alert(data.message);
      return;
    }

    alert("Erreur lors de la mise à jour : " + data.message);
    return;
  }

  window.location.href = "/profile";
};


  return (
    <>
      <Navbar dashboard={false} project={false} profile={true} />
      <main className="px-40 py-12">
        <article className="bg-white border border-[#E5E7EB] px-16 py-8 rounded-xl">
          <h1 className="font-semibold text-xl">Mon compte</h1>
          <h2 className="text-lg text-[#6B7280]">{firstName + " " + lastName}</h2>

          <form
            className="flex flex-col gap-4 mt-10"
            action="/api/edit"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="nom">Nom</label>
              <input
                id="nom"
                type="text"
                name="nom"
                defaultValue={lastName}
                className="border border-[#E5E7EB] h-13 rounded pl-2 text-[#6B7280]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="prenom">Prénom</label>
              <input
                id="prenom"
                type="text"
                name="prenom"
                defaultValue={firstName}
                className="border border-[#E5E7EB] h-13 rounded pl-2 text-[#6B7280]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                defaultValue={user?.email}
                className="border border-[#E5E7EB] h-13 rounded pl-2 text-[#6B7280]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="oldPassword">Ancien mot de passe</label>
              <input
                id="oldPassword"
                type="password"
                name="oldPassword"
                className="border border-[#E5E7EB] h-13 rounded pl-2 text-[#6B7280]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className={`border h-13 rounded pl-2 text-[#6B7280] ${
                  passwordError ? "border-red-500" : "border-[#E5E7EB]"
                }`}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-[#1F1F1F] text-lg text-white py-3 w-[18%] rounded-xl hover:opacity-80 mt-3 pl-2"
              >
                Modifier les informations
              </button>

              <LogoutButton />
            </div>
          </form>
        </article>
      </main>
      <Footer />
    </>
  );
}
