import Image from "next/image";
import { Project } from "../types";
import { useProjectsTasks } from "../hooks/useProjectsTasks";
import Link from "next/link";

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
  const { tasks } = useProjectsTasks(props.id);
  const doneTasks = tasks?.filter((task) => task.status === "DONE");
  const nbTasksDone: number = doneTasks?.length || 0;
  const nbTasks: number = props._count?.tasks || 0;
  const progress: number = (nbTasksDone * 100) / nbTasks || 0;

  return (
  
    <Link
  href={`/projects/${props.id}`}
  className="px-10 py-8 border border-[#E5E7EB] bg-white rounded-xl flex flex-col justify-center gap-10 sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
  aria-labelledby={`project-title-${props.id}`}
  aria-label={`Ouvrir le projet ${props.name}`}
>
  <div className="flex flex-col gap-2">
    <h4
      className="font-semibold text-lg"
      id={`project-title-${props.id}`}
    >
      {props.name}
    </h4>

    <p className="text-sm text-[#6B7280]">{props.description}</p>
  </div>

  <div>
    <div className="flex justify-between mb-2">
      <p className="text-[#6B7280]">Progression</p>
      <p>{progress.toFixed(0)}%</p>
    </div>

   <progress className="my-progress" value={progress.toFixed(0)} max={100} />

    <p className="text-[#6B7280] text-xs">
      {nbTasksDone}/{nbTasks} tâches terminées
    </p>
  </div>

  <div className="flex flex-col gap-3">
    <div className="flex gap-2">
      <Image src="/team.svg" height={15} width={15} alt="" aria-hidden="true" />
      <p className="text-[#6B7280] text-xs">
        Équipe ({props.members.length + 1})
      </p>
    </div>

    <div className="flex items-center flex-wrap" aria-label="Membres de l'équipe">

      <span
        className="bg-[#FFE8D9] p-2 rounded-full border text-xs border-white mr-2"
        aria-label={`Propriétaire : ${ownerInitials}`}
      >
        {ownerInitials}
      </span>

      <span
        className="bg-[#FFE8D9] px-2 py-1 rounded-full border border-white text-[#D3590B] mr-2"
      >
        Propriétaire
      </span>

      {memberInitials?.map((member: string, index: number) => (
        <span
          key={index}
          className="bg-[#E5E7EB] p-2 rounded-full border text-xs border-white mr-[-8]"
          aria-label={`Membre ${index + 1} : ${member}`}
        >
          {member}
        </span>
      ))}

    </div>
  </div>
</Link>

    
  );
}
