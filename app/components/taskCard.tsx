import Image from "next/image";
import { Task } from "../types";
import { useState } from "react";
import { useUser } from "../userContext";
import ModalUpdateTask from "./modalUpdateTask";
import { createPortal } from "react-dom";
import type { User } from "../types";
import { toast } from "sonner";

interface taskProps {
  task: Task;
  getInitials: (name: string | undefined) => string;
  contributorList: User[] | undefined;
  refreshTasks: () => void;
}

export default function TaskCard({ task, getInitials, contributorList, refreshTasks }: taskProps) {
  const [openComments, setOpenComments] = useState(false);
  const currentUser = useUser();
  const [updateTask, setUpdateTask] = useState(false);
  const [comment, setComment] = useState<string>("");

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

  const createComment = async () => {
    if (!comment) {
      return;
    }

    const formData = new FormData();
    formData.append("content", comment);
    formData.append("taskId", task.id);
    formData.append("projectId", task.projectId);

    const res = await fetch("/api/createComment", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Le commentaire vient d'être posté");
      refreshTasks();
      setComment("");
    } else {
      toast.error("Erreur dans l'envoi du commentaire");
    }
  };

  const deleteComment = async (commentId : string) => {
    const ok = window.confirm("Voulez-vous vraiment supprimer ce commentaire ?");
    if (!ok) {
      return;
    }
    const formData = new FormData();
    formData.append("taskId", task.id);
    formData.append("projectId", task.projectId);
    formData.append("commentId", commentId);

    const res = await fetch("/api/deleteComment", {
      method: "POST",
      body: formData
    });

       console.log(await res.json());

    if (res.ok) {
      toast.success("Le commentaire vient d'être supprimé");
      refreshTasks();
    } else {
      toast.error("Erreur dans la suppression du commentaire");
    }
  };

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
        <button onClick={() => setUpdateTask(true)} className="bg-white border p-5 rounded-xl border-[#E5E7EB] flex items-center justify-center">
          <Image src="/menu.svg" height={15} width={15} alt="menu" />
        </button>
      </div>
      {updateTask &&
        createPortal(
          <ModalUpdateTask
            refresh={refreshTasks}
            task={task}
            closeModal={() => setUpdateTask(false)}
            onSuccess={() => {
              setUpdateTask(false);
              refreshTasks();
            }}
            contributorList={contributorList}
          />,
          document.body
        )}
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
    ${openComments ? "opacity-100 mt-5" : "max-h-0 opacity-0"}
  `}
      >
        <div className="flex flex-col gap-4 ">
          {task.comments.length === 0 && <p className="text-sm text-[#6B7280]">Aucun commentaire</p>}

          {task.comments.map((comment, index) => {
            const isCurrentUser = comment.author.id === currentUser?.id;

            return (
              <div key={index} className="flex gap-5 items-start">
                <div className="flex items-center gap-2">
                  <span className={`p-2 rounded-full text-xs ${isCurrentUser ? "bg-[#FFE8D9]" : "bg-[#E5E7EB]"}`}>
                    {getInitials(comment.author.name)}
                  </span>
                </div>

                <div className="flex bg-[#F3F4F6] rounded-xl w-full p-5 justify-between">
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">{comment.author.name}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <p className="text-xs text-[#6B7280]">
                      {new Date(comment.createdAt).toLocaleString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {isCurrentUser && (
                      <button className="self-end bg-[#1F1F1F] rounded-lg p-2" onClick={()=>deleteComment(comment.id)}>
                        <Image src="/Trash.svg" height={20} width={20} alt="delete" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-5 items-start">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-full text-xs bg-[#FFE8D9]`}>{getInitials(currentUser?.name)}</span>
            </div>

            <textarea
              name="comment"
              id=""
              placeholder="Ajouter un commentraire..."
              className="bg-[#F3F4F6] rounded-xl w-full p-5 resize-none border-none outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <button className="text-white text-md bg-[#1F1F1F] rounded-lg p-3 mt-3 self-end w-[25%]" onClick={createComment}>
            Envoyer
          </button>
        </div>
      </div>
    </article>
  );
}
