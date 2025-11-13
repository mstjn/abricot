import Image from "next/image";
export default function TaskList() {
  return (
    <article className="px-10 py-6 border border-[#E5E7EB] rounded-xl">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-xl">Nom de la tâche</h4>
          <p className="text-md text-[#6B7280]">Description de la tâche</p>
        </div>
        <span className="bg-[#FFE0E0] rounded-full text-[#EF4444] h-7 px-3 flex items-center justify-center">A faire</span>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4 mt-8 justify-center items-center">
          <span className="flex gap-2 items-center">
            <Image src="/folder.svg" alt="" height={16} width={16} />
            <p className="text-[#6B7280] text-xs">Nom du projet</p>
          </span>
          <p className="text-[#9CA3AF]">|</p>
          <span className="flex gap-2 items-center">
            <Image src="/calendar.svg" alt="" height={16} width={16} />
            <p className="text-[#6B7280] text-xs">9 mars</p>
          </span>
          <p className="text-[#9CA3AF]">|</p>
          <span className="flex gap-2  items-center">
            <Image src="/comment.svg" alt="" height={16} width={16} />
            <p className="text-[#6B7280] text-xs">2</p>
          </span>
        </div>
        <button className="text-white bg-[#1F1F1F] rounded-xl py-3 px-12">Voir</button>
      </div>
    </article>
  );
}
