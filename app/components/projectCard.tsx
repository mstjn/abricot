import Image from "next/image";
import { Project } from "../types";

interface projectProps {
  props: Project;
}
export default function ProjectCard({ props }: projectProps) {
  const getInitials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";

  const memberInitials = props.members.map((m) => getInitials(m.user?.name));

  const ownerInitials = getInitials(props.owner?.name);

  return (
    <article className="px-10 py-8 border border-[#E5E7EB] bg-white rounded-xl flex flex-col gap-10 sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]">
      <div className="flex flex-col gap-2">
        <h4 className="font-semibold text-lg">{props.name}</h4>
        <p className="text-sm text-[#6B7280]">{props.description}</p>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <p className="text-[#6B7280]">Progression</p>
          <p>0%</p>
        </div>

        <progress className="my-progress" value={0} max={1} />
        <p className="text-[#6B7280] text-xs">0/{props._count?.tasks} tâches terminées</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Image src="/team.svg" height={15} width={15} alt="team" />
          <p className="text-[#6B7280] text-xs">Equipe ({props.members.length + 1})</p>
        </div>

        <div className="flex items-center">
          <span className="bg-[#FFE8D9] p-2 rounded-full border text-xs border-white mr-2">{ownerInitials}</span>
          <span className="bg-[#FFE8D9] px-2 py-1 rounded-full border  border-white text-[#D3590B] mr-2">Propriétaire</span>
          {memberInitials?.map((member: string, index: number) => (
            <span key={index} className="bg-[#E5E7EB] p-2 rounded-full border text-xs border-white mr-[-8]">
              {member}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
