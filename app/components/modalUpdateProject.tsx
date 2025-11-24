import Image from "next/image";
import { useState } from "react";

export default function ModalUpdateProject({ closeModal }: { closeModal: () => void }) {
  const contributorsList = ["Matéo", "John", "Emma", "Sarah"];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (item: string) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  return (
    <aside onClick={closeModal} className="fixed inset-0 bg-slate-800/50 flex items-center justify-center">
      <div className="bg-white relative p-16 rounded-lg flex flex-col gap-10 w-[25%]" onClick={(e) => e.stopPropagation()} >
        <p className="font-semibold text-2xl">Modifier un projet</p>
        <form action="" className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Titre*</label>
            <input type="text" className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description*</label>
            <input type="text" className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs" />
          </div>
          <div className="flex flex-col gap-1 relative">
            <label>Contributeurs</label>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="border border-[#E5E7EB] rounded h-12 pl-2 text-left text-[#6B7280] text-xs"
            >
              {selected.length > 0 ? selected.join(", ") : "Choisir un ou plusieurs collaborateurs"}
            </button>

            {open && (
              <div className="absolute top-19 left-0 w-full bg-white border border-[#E5E7EB] rounded shadow-md p-2 z-20">
                {contributorsList.map((item) => (
                  <label key={item} className="flex items-center gap-2 p-1 text-sm">
                    <input type="checkbox" checked={selected.includes(item)} onChange={() => toggleSelect(item)} />
                    {item}
                  </label>
                ))}
              </div>
            )}
          </div>

          <button className="text-white text-md w-[50%] bg-[#1F1F1F] rounded-lg p-3"  type="submit">Enregistrer</button>
        </form>
        <button className="absolute top-5 right-5" onClick={closeModal}>
          <Image src="/close.svg" height={15} width={15} alt="close" />
        </button>
      </div>
    </aside>
  );
}
