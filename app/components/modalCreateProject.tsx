"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { User } from "../types";
import AutocompleteUsers from "./autocompleteUsers";
import { useEffect } from "react";
export default function ModalCreateProject({
  closeModal,
  onSuccess,
}: {
  closeModal: () => void;
  onSuccess: () => void;
}) {
  const [contributors, setContributors] = useState<User[]>([]);

  const addContributor = (user: User) => {
    if (!contributors.some((c) => c.id === user.id)) {
      setContributors((prev) => [...prev, user]);
    }
  };

  const removeContributor = (id: string) => {
    setContributors((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.append(
      "contributors",
      JSON.stringify(contributors.map((u) => u.email))
    );

    const res = await fetch("/api/createProject", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Le nouveau projet a bien été créé");
      onSuccess();
    } else {
      toast.error("Erreur dans la création du projet");
    }
  };

  useEffect(() => {
  const closeOnEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeModal();
  };
  document.addEventListener("keydown", closeOnEsc);
  return () => document.removeEventListener("keydown", closeOnEsc);
},[]);

  

  return (
    <aside
      onClick={closeModal}
      className="fixed inset-0 bg-slate-800/50 flex items-center justify-center"
    >
      <div
        className="bg-white relative lg:p-16 p-8 rounded-lg flex flex-col gap-10 xl:w-[25%] lg:w-[40%] w-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold text-2xl">Créer un projet</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Titre*</label>
            <input
            id="title"
              required
              type="text"
              name="name"
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description*</label>
            <input
              required
              id="description"
              type="text"
              name="description"
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Contributeurs</label>
            <AutocompleteUsers onSelect={addContributor} />
            {contributors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {contributors.map((user) => (
                  <div
                    key={user.id}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-xs"
                  >
                    {user.name}
                    <button
                      type="button"
                      onClick={() => removeContributor(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="text-white text-md w-40 bg-[#1F1F1F] rounded-lg p-3 mt-3"
            type="submit"
          >
            Ajouter un projet
          </button>
        </form>
        <button className="absolute top-5 right-5" onClick={closeModal}>
          <Image src="/close.svg" height={15} width={15} alt="close" />
        </button>
      </div>
    </aside>
  );
}
