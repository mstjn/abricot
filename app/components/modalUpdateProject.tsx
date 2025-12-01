import Image from "next/image";
import { useState } from "react";
import { Project } from "../types";
import { toast } from "sonner";
import AutocompleteUpdate from "./autocompleteUpdate";
import type { User } from "../types";

export default function ModalUpdateProject({
  closeModal,
  project,
  onSuccess,
}: {
  closeModal: () => void;
  project: Project | undefined;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(project?.name);
  const [description, setDescription] = useState(project?.description);
  const [contributors, setContributors] = useState<User[]>(project?.members.map((user) => user.user) || []);

  const addContributor = async (user: User) => {
    if (!contributors.some((c) => c.id === user.id)) {
      setContributors((prev) => [...prev, user]);

      const res = await fetch("/api/addContributor", {
        method: "POST",
        body: user.email,
      });

      if (res.ok) {
        toast.success("Un contributeur vient d'être ajouté");
      } else {
        toast.error("Erreur dans l'ajout d'un contributeur");
      }
    }
  };

  const removeContributor = async (id: string) => {
    setContributors((prev) => prev.filter((u) => u.id !== id));
    const res = await fetch("/api/removeContributor", {
        method: "POST",
        body: id,
      });

      if (res.ok) {
        toast.success("Un contributeur vient d'être supprimé");
      } else {
        toast.error("Erreur dans la supression d'un contributeur");
      }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/editProject", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Le projet a bien été modifié");
      onSuccess();
    } else {
      toast.error("Erreur dans la modification du projet");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Es-tu sûr de vouloir supprimer ce projet ?");

    if (!ok) return;
    const res = await fetch("/api/deleteProject", {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Le projet a bien été supprimé");
      window.location.href = "/projects";
    } else {
      toast.error("Erreur dans la suppression du projet");
    }
  };

  return (
    <aside onClick={closeModal} className="fixed inset-0 bg-slate-800/50 flex items-center justify-center">
      <div className="bg-white relative lg:p-16 p-5 rounded-lg flex flex-col gap-10 lg:w-[40%] w-[90%] xl:w-[25%]" onClick={(e) => e.stopPropagation()}>
        <p className="font-semibold text-2xl">Modifier un projet</p>
        <form action="" className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Titre*</label>
            <input
              type="text"
              name="name"
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description*</label>
            <input
              type="text"
              name="description"
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Contributeurs</label>
            <AutocompleteUpdate onSelect={addContributor} />

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
          <div className="flex gap-5">
            <button className="text-white text-md w-[50%] bg-[#1F1F1F] rounded-lg p-3" type="submit">
              Enregistrer
            </button>
            <button className="text-white text-md w-[50%] bg-red-500 rounded-lg p-3" type="button" onClick={handleDelete}>
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
