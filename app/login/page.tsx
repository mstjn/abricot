"use client";

import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(JSON.stringify({ email, password }));

    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      Cookies.set("token", data.data.token, { expires: 1 });
      window.location.href = "/";
    } else {
      setError(true);
    }
  };

  return (
    <div className="">
      <div className="bg-[#F9FAFB] w-[35%] h-screen flex flex-col items-center justify-between py-20">
        <Image alt="" height={100} width={250} src="/Logo.png" />

        <div className="w-full flex flex-col items-center gap-10">
          <h1 className="text-[#D3590B] font-bold text-4xl">Connexion</h1>
          <form onSubmit={handleLogin} className="flex flex-col w-[50%] gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="mail" className="text-sm">
                Email
              </label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                value={email}
                type="email"
                id="mail"
                className={`bg-white border ${error ? "border-red-500" : "border-[#E5E7EB]"}  h-12 px-2`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm">
                Mot de passe
              </label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                value={password}
                type="password"
                id="password"
                className={`bg-white border ${error ? "border-red-500" : "border-[#E5E7EB]"}  h-12 px-2`}
              />
            </div>

            {error && <p className="text-red-500 self-center">Les identifiants sont incorrects</p>}

            <button className="bg-[#1F1F1F] text-lg text-white rounded-xl h-12 w-[85%] self-center hover:opacity-80">Se connecter</button>
            <u className="text-[#D3590B] text-sm self-center">Mot de passe oublié?</u>
          </form>
        </div>

        <p className="text-sm">
          Pas encore de compte ?{" "}
          <u className="text-[#D3590B]">
            <Link href="/sign-in">Créer un compte</Link>
          </u>
        </p>
      </div>

      <Image alt="" fill className="-z-10 object-cover" src="/login.jpg" />
    </div>
  );
};

export default Page;
