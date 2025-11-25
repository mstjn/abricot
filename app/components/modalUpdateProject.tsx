import Image from "next/image";
import { useState } from "react";
import { Project } from "../types";
import { toast } from "sonner";

export default function ModalUpdateProject({ closeModal, project, onSuccess }: { closeModal: () => void ; project : Project | undefined ; onSuccess : () => void}) {

  const [name, setName] = useState(project?.name)
  const [description, setDescription] = useState(project?.description)


  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
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
 

  return (
    <aside onClick={closeModal} className="fixed inset-0 bg-slate-800/50 flex items-center justify-center">
      <div className="bg-white relative p-16 rounded-lg flex flex-col gap-10 w-[25%]" onClick={(e) => e.stopPropagation()} >
        <p className="font-semibold text-2xl">Modifier un projet</p>
        <form action="" className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Titre*</label>
            <input type="text" name="name" className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description*</label>
            <input type="text" name="description" className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs" value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>

          <button className="text-white text-md w-[50%] bg-[#1F1F1F] rounded-lg p-3" type="submit">Enregistrer</button>
        </form>
        <button className="absolute top-5 right-5" onClick={closeModal}>
          <Image src="/close.svg" height={15} width={15} alt="close" />
        </button>
      </div>
    </aside>
  );
}
