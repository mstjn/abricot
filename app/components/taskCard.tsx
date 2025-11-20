import Link from "next/link";
import Image from "next/image";
import { Task } from "../types";
import { useState } from "react";
import { useUser } from "../userContext";

interface taskProps {
  task: Task;
  getInitials: (name: string | undefined) => string;
}

export default function TaskCard({ task, getInitials }: taskProps) {
  const [openComments, setOpenComments] = useState(false);
  const currentUser = useUser();


  let statusLabel = "";
  let statusColor = "";

  switch (task.status) {
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

  const assignes = task?.assignees.map((m) => m.user?.name);
  const assignesInitials = assignes.map((m) => getInitials(m));

  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })
    : "";
  return (
    <article className={`px-10 ${openComments ? "py-6" : "pt-6"} border border-[#E5E7EB] rounded-xl flex flex-col gap-6`}>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-5 items-center">
            <h4 className="font-semibold text-xl">{task.title}</h4>
            <span className={`${statusColor} rounded-full h-7 px-3 flex items-center justify-center text-sm`}>{statusLabel}</span>
          </div>
          <p className=" text-[#6B7280]">{task.description}</p>
        </div>
        <Link className="bg-white border p-5 rounded-xl border-[#E5E7EB] flex items-center justify-center" href="">
          <Image src="/menu.svg" height={15} width={15} alt="menu" />
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        <p className="text-[#6B7280] text-sm">Echéance :</p>
        <Image src="/calendar-black.svg" alt="" height={16} width={16} />
        <p className="text-sm ">{dueDateFormatted}</p>
      </div>

      <div className="flex gap-2 items-center">
        <p className="text-[#6B7280] text-sm">Assigné à :</p>
        {assignesInitials?.map((member: string, index: number) => (
          <div key={index} className="flex items-center">
            <span className="bg-[#E5E7EB] p-2 rounded-full border border-white text-xs  mr-2">{member}</span>
            <span className="bg-[#E5E7EB] px-2 py-1 rounded-full mr-5 text-[#6B7280]">{assignes?.[index]}</span>
          </div>
        ))}
      </div>

      <div onClick={() => setOpenComments(!openComments)} className="flex justify-between border-t border-t-[#E5E7EB] pt-5 cursor-pointer">
        <p>Commentaires ({task.comments.length})</p>
        <Image
          src={openComments ? "/menu-close.svg" : "/menu-up.svg"}
          alt="toggle"
          height={16}
          width={16}
          className={`transition-transform duration-300 ${openComments ? "rotate-180" : ""}`}
        />
      </div>

      <div
        className={`
    overflow-hidden transition-all duration-500 ease-in-out
    ${openComments ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0"}
  `}
      >
        <div className="flex flex-col gap-4 ">
          {task.comments.length === 0 && <p className="text-sm text-[#6B7280]">Aucun commentaire</p>}

         {task.comments.map((comment, index) => {
  const isCurrentUser = comment.author.id === currentUser?.id;

  return (
    <div key={index} className="flex gap-5 items-start">
      {/* Avatar with color condition */}
      <div className="flex items-center gap-2">
        <span
          className={`p-2 rounded-full text-xs ${
            isCurrentUser ? "bg-[#FFE8D9]" : "bg-[#E5E7EB]"
          }`}
        >
          {getInitials(comment.author.name)}
        </span>
      </div>

      <div className="flex bg-[#F3F4F6] rounded-xl w-full p-5 justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-semibold">{comment.author.name}</p>
          <p className="text-sm">{comment.content}</p>
        </div>

        <p className="text-xs text-[#6B7280]">
          {new Date(comment.createdAt).toLocaleString("fr-FR", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
})}

                
        </div>
      </div>
    </article>
  );
}
