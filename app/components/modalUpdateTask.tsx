"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Task, User } from "../types";
import { Calendar28 } from "./formatDate";
import AutocompleteTasks from "./autocompleteTasks";

export default function ModalUpdateTask({
  closeModal,
  onSuccess,
  contributorList,
  task,
  refresh
}: {
  task: Task;
  refresh : ()=>void;
  contributorList: User[] | undefined;
  closeModal: () => void;
  onSuccess: () => void;
}) {
  const assignees: User[] = task.assignees.map((member) => member.user);
  const [contributors, setContributors] = useState<User[]>(assignees);
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED">(task.status);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState<string>(task.dueDate);

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
    formData.append("id", task.projectId || "");
    formData.append("taskId", task.id || "");

    const res = await fetch("/api/editTask", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("La tâche à bien été modifiée");
      onSuccess();
    } else {
      toast.error("Erreur dans la modification de la tâche");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Es-tu sûr de vouloir supprimer cette tache ?");

    if (!ok) return;
    const res = await fetch("/api/deleteTask", {
      method: "POST",
      body : task.id
    });

    if (res.ok) {
      toast.success("La tâche a bien été supprimé");
      refresh()
      closeModal()
    } else {
      toast.error("Erreur dans la suppression de la tâche");
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
      <div className="bg-white relative lg:p-16 p-5 rounded-lg flex flex-col gap-10 xl:w-[25%] lg:w-[40%] w-[90%] h-[85%] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <p className="font-semibold text-2xl">Modifier une tâche</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Titre*</label>
            <input
              required
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description*</label>
            <input
              required
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="date">Echéance*</label>
            <Calendar28 dateUpdate={date} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="assignes">Assigné à :</label>
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
            <label>Status :</label>

            <input type="hidden" name="status" value={status} />

            <div className="flex gap-2">
              <span
                onClick={() => setStatus("TODO")}
                className={`
        cursor-pointer rounded-full h-7 px-3 flex items-center justify-center text-sm
        ${status === "TODO" ? "bg-[#FFE0E0] text-[#EF4444]" : "bg-gray-100 text-gray-500"}
      `}
              >
                À faire
              </span>

              <span
                onClick={() => setStatus("IN_PROGRESS")}
                className={`
        cursor-pointer rounded-full h-7 px-3 flex items-center justify-center text-sm
        ${status === "IN_PROGRESS" ? "bg-[#FFF0D7] text-[#E08D00]" : "bg-gray-100 text-gray-500"}
      `}
              >
                En cours
              </span>
              <span
                onClick={() => setStatus("DONE")}
                className={`
        cursor-pointer rounded-full h-7 px-3 flex items-center justify-center text-sm
        ${status === "DONE" ? "bg-[#F1FFF7] text-[#27AE60]" : "bg-gray-100 text-gray-500"}
      `}
              >
                Terminée
              </span>
            </div>
          </div>
          <div className="flex gap-5">
            {" "}
            <button className="text-white text-md w-[50%] bg-[#1F1F1F] rounded-lg p-3 mt-3" type="submit">
              Enregistrer
            </button>
            <button className="text-white text-md w-[50%] bg-red-400 rounded-lg p-3 mt-3" type="button" onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        </form>
        <button className="absolute top-5 right-5" onClick={closeModal}>
          <Image src="/close.svg" height={15} width={15} alt="close" />
        </button>
      </div>
    </aside>
  );
}
