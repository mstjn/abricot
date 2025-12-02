"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User } from "../types";
import { Calendar28 } from "./formatDate";
import AutocompleteTasks from "./autocompleteTasks";

export default function ModalCreateTask({
  closeModal,
  onSuccess,
  contributorList,
  id,
}: {
  id: string | undefined;
  contributorList: User[] | undefined;
  closeModal: () => void;
  onSuccess: () => void;
}) {
  const [contributors, setContributors] = useState<User[]>([]);
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("LOW");

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

    formData.append("assigneeIds", JSON.stringify(contributors.map((u) => u.id)));
    formData.append("id", id || "");

    const res = await fetch("/api/createTask", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("La tâche à bien été créee");
      onSuccess();
    } else {
      toast.error("Erreur dans la création de la tâche");
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
    <aside onClick={closeModal} className="fixed inset-0 bg-slate-800/50 flex items-center justify-center">
      <div
        className="bg-white relative lg:p-14 p-5 rounded-lg flex flex-col gap-10 xl:w-[25%] lg:w-[40%] w-[90%] h-[85%] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold text-2xl">Créer une tâche</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Titre*</label>
            <input required id="title" type="text" name="title" className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description*</label>
            <input required id="description" type="text" name="description" className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label>Echéance*</label>
            <Calendar28 />
          </div>

          <div className="flex flex-col gap-1">
            <label>Assigné à :</label>
            <AutocompleteTasks users={contributorList} onSelect={addContributor} />

            {contributors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {contributors.map((user) => (
                  <div key={user.id} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-xs">
                    {user.name}
                    <button type="button" onClick={() => removeContributor(user.id)} className="text-red-500 hover:text-red-700">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>Priorité :</label>
            <input type="hidden" name="priority" value={priority} />

            <div className="flex gap-2 overflow-auto">
              <span
                onClick={() => setPriority("URGENT")}
                className={`
        cursor-pointer rounded-full h-7 px-3 flex items-center justify-center text-sm
        ${priority === "URGENT" ? "bg-[#FFE5E5] text-[#D92D20]" : "bg-gray-100 text-gray-500"}
      `}
              >
                Urgente
              </span>

              <span
                onClick={() => setPriority("HIGH")}
                className={`
        cursor-pointer rounded-full h-7 px-3 flex items-center justify-center text-sm
        ${priority === "HIGH" ? "bg-[#FFF4D6] text-[#B54708]" : "bg-gray-100 text-gray-500"}
      `}
              >
                Élevée
              </span>
              <span
                onClick={() => setPriority("MEDIUM")}
                className={`
        cursor-pointer rounded-full h-7 px-3 flex items-center justify-center text-sm
        ${priority === "MEDIUM" ? "bg-[#E8F4FF] text-[#1E6BB8]" : "bg-gray-100 text-gray-500"}
      `}
              >
                Moyenne
              </span>
              <span
                onClick={() => setPriority("LOW")}
                className={`
        cursor-pointer rounded-full h-7 px-3 flex items-center justify-center text-sm
        ${priority === "LOW" ? "bg-[#F1FFF7] text-[#27AE60]" : "bg-gray-100 text-gray-500"}
      `}
              >
                Faible
              </span>
            </div>
          </div>

          <button className="text-white text-md w-[50%] bg-[#1F1F1F] rounded-lg p-3 mt-3" type="submit">
            + Ajouter une tâche
          </button>
        </form>
        <button className="absolute top-5 right-5" onClick={closeModal}>
          <Image src="/close.svg" height={15} width={15} alt="close" />
        </button>
      </div>
    </aside>
  );
}
