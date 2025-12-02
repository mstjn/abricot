"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Task } from "../types";
import Image from "next/image";

export default function ModalIaGeneration({ closeModal, id, refresh }: { closeModal: () => void; id: string | undefined; refresh: () => void }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // 🔥 Génération IA
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Le contenu ne peut pas etre vide");
      return;
    }

    setLoading(true);
    setTasks([]);

    const res = await fetch("/api/IA", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Erreur IA");
      console.log(await res.json());
      return;
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    setTasks(parsed.tasks);
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const addAllTasks = async () => {
    if (tasks.length === 0) {
      toast.error("Aucune tâche à ajouter");
      return;
    }

    setSaving(true);

    let success = 0;
    let fail = 0;

    for (const task of tasks) {
      const formData = new FormData();
      formData.append("title", task.title);
      formData.append("description", task.description);
      formData.append("id", id || "");

      formData.append("dueDate", new Date().toISOString());
      formData.append("priority", "LOW");
      formData.append("assigneeIds", JSON.stringify([]));

      const res = await fetch("/api/createTask", {
        method: "POST",
        body: formData,
      });

      console.log(await res.json());

      if (res.ok) success++;
      else fail++;
    }

    setSaving(false);

    if (success > 0) toast.success(`${success} tâche(s) ajoutée(s)`);
    if (fail > 0) toast.error(`${fail} tâche(s) non ajoutée(s)`);

    if (success > 0) {
      closeModal();
      refresh();
    }
  };

  return (
    <aside onClick={closeModal} className="fixed inset-0 bg-slate-800/50 flex items-center justify-center">
      <div
        className="bg-white relative lg:px-12 lg:py-10 p-5 rounded-lg flex flex-col gap-10 xl:w-[30%] lg:w-[40%] w-[90%] h-[85%] justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 items-center">
          <Image src="/Star.svg" height={15} width={15} alt="star" />
          <h2 className="text-xl font-semibold">{tasks.length > 0 ? "Vos tâches..." : "Créer une tâche"}</h2>
        </div>

        {loading && <div className="text-center text-gray-600 italic">Génération des tâches en cours...</div>}

        {tasks.length > 0 && (
          <div className="flex flex-col gap-4 overflow-auto">
            {tasks.map((task, index) => (
              <div key={index} className="border border-[#E5E7EB] rounded-lg flex-col p-5 flex gap-2">
                {editingIndex === index ? (
                  <>
                    <input className="border px-2 py-1 rounded w-full" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />

                    <textarea
                      className="border px-2 py-1 rounded w-full text-sm"
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold">{task.title}</h4>
                    <p className="text-[#6B7280] text-sm">{task.description}</p>
                  </>
                )}

                <div className="flex gap-2">
                  {editingIndex === index ? (
                    <div className="flex gap-3">
                      <button
                        className="text-green-600 text-sm"
                        onClick={() => {
                          setTasks((prev) => prev.map((t, i) => (i === index ? { ...t, title: editTitle, description: editDescription } : t)));
                          setEditingIndex(null);
                        }}
                      >
                        Valider
                      </button>

                      <button
                        className="text-red-500 text-sm"
                        onClick={() => {
                          setEditingIndex(null);
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex gap-2 items-center cursor-pointer" onClick={() => removeTask(index)}>
                        <Image src="/delete.svg" alt="delete" height={16} width={16} />
                        <p className="text-[#6B7280] text-sm">Supprimer</p>
                      </span>

                      <p className="text-[#9CA3AF]">|</p>

                      <span
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={() => {
                          setEditingIndex(index);
                          setEditTitle(task.title);
                          setEditDescription(task.description);
                        }}
                      >
                        <Image src="/edit.svg" alt="edit" height={16} width={16} />
                        <p className="text-[#6B7280] text-sm">Modifier</p>
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}

            <button onClick={addAllTasks} disabled={saving} className="bg-[#1F1F1F] rounded-lg text-white p-2 w-42 self-center">
              {saving ? "Ajout..." : "+ Ajouter les tâches"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex bg-[#F9FAFB] p-3 rounded-full justify-between">
          <input
            className="w-full"
            placeholder="Décrivez les tâches que vous souhaitez ajouter..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit" className="bg-[#D3590B] p-2 rounded-full" disabled={loading}>
            <Image src="/ia.svg" width={15} height={15} alt="IA" />
          </button>
        </form>

        <button className="absolute top-5 right-5" onClick={closeModal}>
          <Image src="/close.svg" height={15} width={15} alt="close" />
        </button>
      </div>
    </aside>
  );
}
