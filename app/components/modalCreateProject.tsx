"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import AutocompleteUsers from "./AutocompleteUsers";
import { User } from "../types"; // le composant qu’on crée juste après

export default function ModalCreateProject({
  closeModal,
  onSuccess,
}: {
  closeModal: () => void;
  onSuccess: () => void;
}) {
  const [contributors, setContributors] = useState<User[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 👉 Ajouter les contributeurs sélectionnés
    formData.append("contributors", JSON.stringify(contributors.map((u) => u.id)));

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

  return (
    <aside
      onClick={closeModal}
      className="fixed inset-0 bg-slate-800/50 flex items-center justify-center"
    >
      <div
        className="bg-white relative p-16 rounded-lg flex flex-col gap-10 w-[25%]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold text-2xl">Créer un projet</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Titre*</label>
            <input
              required
              type="text"
              name="name"
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Description*</label>
            <input
              required
              type="text"
              name="description"
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs"
            />
          </div>

          {/* Champ d’autocomplétion */}
          <div className="flex flex-col gap-1">
            <label>Contributeurs</label>
            <AutocompleteUsers
              onSelect={(user : User) => {
                // éviter les doublons
                if (!contributors.find((u) => u.id === user.id)) {
                  setContributors([...contributors, user]);
                }
              }}
            />

            {/* Affichage des utilisateurs sélectionnés */}
            <div className="flex flex-wrap gap-2 mt-2">
              {contributors.map((user) => (
                <div
                  key={user.id}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-2"
                >
                  {user.name}
                  <button
                    type="button"
                    onClick={() =>
                      setContributors(contributors.filter((u) => u.id !== user.id))
                    }
                  >
                    <Image src="/close.svg" height={10} width={10} alt="remove" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="text-white text-md w-[50%] bg-[#1F1F1F] rounded-lg p-3"
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
