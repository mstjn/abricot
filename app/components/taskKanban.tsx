import Image from "next/image";
import type { TaskProjectItem } from "../types";
import Link from "next/link";

interface PropsTK {
  props: TaskProjectItem;
}

export default function TaskKanban({ props }: PropsTK) {
  let statusLabel = "";
  let statusColor = "";

  switch (props.status) {
    case "IN_PROGRESS":
      statusLabel = "En cours";
      statusColor = "bg-[#FFF0D7] text-[#E08D00]";
      break;

    case "DONE":
      statusLabel = "Terminée";
      statusColor = "bg-[#F1FFF7] text-[#27AE60]";
      break;

    case "TODO":
    default:
      statusLabel = "À faire";
      statusColor = "bg-[#FFE0E0] text-[#EF4444]";
      break;
  }

  const dueDateFormatted = props.dueDate
    ? new Date(props.dueDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <article 
  className="px-5 xl:px-10 py-6 border border-[#E5E7EB] rounded-xl flex flex-col gap-5"
  aria-label={`task-title-${props.title}`}
>
  <div className="flex-col">
    <div className="flex justify-between mb-2 xl:mb-5">
      <h4 
        className="font-semibold text-lg"
        id={`task-title-${props.title}`}
      >
        {props.title}
      </h4>

      <span 
        className={`${statusColor} rounded-full h-7 px-3 flex items-center justify-center shrink-0 whitespace-nowrap`}
        role="status"
        aria-label={`Statut : ${statusLabel}`}
      >
        {statusLabel}
      </span>
    </div>

    <p className="text-sm text-[#6B7280]">{props.description}</p>
  </div>

  <div className="flex justify-between">
    <div className="flex flex-col gap-4 xl:flex-row xl:justify-center xl:items-center">

      <span className="flex gap-2 items-center" aria-label="Projet associé">
        <Image src="/folder.svg" alt="" height={16} width={16} aria-hidden="true" />
        <p className="text-[#6B7280] text-xs">{props.projectName}</p>
      </span>

      <p className="text-[#9CA3AF] hidden xl:block" aria-hidden="true">|</p>

      <span className="flex gap-2 items-center" aria-label="Date limite">
        <Image src="/calendar.svg" alt="" height={16} width={16} aria-hidden="true" />
        <p className="text-[#6B7280] text-xs">{dueDateFormatted}</p>
      </span>

      <p className="text-[#9CA3AF] hidden xl:block" aria-hidden="true">|</p>

      <span className="flex gap-2 items-center" aria-label="Nombre de commentaires">
        <Image src="/comment.svg" alt="" height={16} width={16} aria-hidden="true" />
        <p className="text-[#6B7280] text-xs">{props.commentsCount}</p>
      </span>

    </div>
  </div>

  <Link 
    href={`/projects/${props.projectID}`} 
    className="text-white bg-[#1F1F1F] rounded-xl py-3 flex justify-center self-center xl:self-start w-25"
    aria-label={`Voir le projet ${props.projectName}`}
  >
    Voir
  </Link>
</article>

  );
}
