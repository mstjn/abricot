"use client";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useProjectsWithTasks } from "./hooks/useProjectsWithTasks";
import { useUser } from "./userContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import TaskKanban from "./components/taskKanban";
import TaskList from "./components/taskList";
import type { TaskProjectItem } from "./types";
import { createPortal } from "react-dom";
import ModalCreateProject from "./components/modalCreateProject";

export default function HomePage() {
  const { projects, refresh } = useProjectsWithTasks();
  const user = useUser();
  const [view, setView] = useState<boolean>(true);
  const tasksProjects: TaskProjectItem[] = [];
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  projects?.forEach((project) => {
    project.tasks?.forEach((task) => {
      tasksProjects.push({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        commentsCount: task.comments.length,
        projectName: project.name,
        projectID: project.id,
      });
    });
  });

  const priorityOrder = { URGENT: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };

  tasksProjects.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const filteredTasks = tasksProjects.filter((task) => {
    const q = search.toLowerCase();
    return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q) || task.projectName.toLowerCase().includes(q);
  });

  const tasksToDo = tasksProjects.filter((task) => task.status === "TODO");
  const tasksInProgress = tasksProjects.filter((task) => task.status === "IN_PROGRESS");
  const tasksDone = tasksProjects.filter((task) => task.status === "DONE");

useEffect(() => {
  const root = document.getElementById("app-root");
  if (!root) return;

  root.inert = showModal;
  document.body.style.overflow = showModal ? "hidden" : "";

  return () => {
    root.inert = false;
    document.body.style.overflow = "";
  };
}, [showModal]);


  return (
    <>
      <Navbar dashboard={true} project={false} profile={false} />
      <main className="lg:px-10 px-2 py-20 flex flex-col gap-10 xl:px-20">
        <section className="flex md:flex-row justify-between flex-col">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-2xl">Tableau de bord</h1>
            <h2 className="text-lg mb-5 lg:mb-0">Bonjour {user?.name}, voici un aperçu de vos projets et tâches</h2>
          </div>
          <button className="text-white text-lg bg-[#1F1F1F] rounded-xl h-14 px-6" onClick={() => setShowModal(true)}>
            + Créer un projet
          </button>
          {showModal &&
            createPortal(
              <ModalCreateProject
                closeModal={() => setShowModal(false)}
                onSuccess={() => {
                  refresh();
                  setShowModal(false);
                }}
              />,
              document.body
            )}
        </section>

        <section className="flex gap-5 mt-5">
          <a
            onClick={() => setView(true)}
            className={`cursor-pointer flex gap-3 ${view ? "bg-[#FFE8D9]" : "bg-white"} w-25 items-center justify-center rounded-lg py-3`}
          >
            <Image src="/list.svg" height={16} width={16} alt="Liste" />
            <p className="text-[#D3590B] text-md">Liste</p>
          </a>
          <a
            onClick={() => setView(false)}
            className={`cursor-pointer flex gap-3 ${view ? "bg-white" : "bg-[#FFE8D9]"} w-25  items-center justify-center rounded-lg py-3`}
          >
            <Image src="/kanban.svg" height={16} width={16} alt="Liste" />
            <p className=" text-[#D3590B] text-md">Kanban</p>
          </a>
        </section>

        {view ? (
          <section className="bg-white border border-[#E5E7EB] lg:px-16 px-2 py-10 rounded-xl">
            <div className="flex lg:flex-row flex-col justify-between mb-10">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-xl">Mes tâches assignées</h3>
                <p className="text-[#6B7280] text-lg lg:mb-0 mb-5">Par ordre de priorité</p>
              </div>

              <div className="border border-[#E5E7EB] flex gap-2 px-5 rounded-xl w-70 justify-between">
                
                <input type="text" className="w-full h-15" placeholder="Rechercher une tâche" value={search} aria-label="search" onChange={(e) => setSearch(e.target.value)} />
                <Image src="/search.svg" height={15} width={15} alt="search" />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {filteredTasks.map((tp: TaskProjectItem, index: number) => (
                <TaskList key={index} props={tp} />
              ))}
            </div>
          </section>
        ) : (
          <section className="flex lg:flex-row flex-col lg:justify-between gap-5">
            <div className="flex flex-col  border border-[#FFE0E0] rounded-xl bg-white lg:w-[32%] w-full px-6 py-10 gap-5">
              <div className="flex gap-2 items-center mb-4">
                <h3 className="font-semibold text-xl">À faire</h3>
                <span className="rounded-2xl bg-[#E5E7EB] text-[#6B7280] px-4">{tasksToDo.length}</span>
              </div>
              {tasksToDo.map((tp: TaskProjectItem, index: number) => (
                <TaskKanban key={index} props={tp} />
              ))}
            </div>
            <div className="flex flex-col border border-[#FFE0E0] rounded-xl bg-white lg:w-[32%] w-full px-6 py-10 gap-5">
              <div className="flex gap-2 items-center mb-4">
                <h3 className="font-semibold text-xl">En cours</h3>
                <span className="rounded-2xl bg-[#E5E7EB] text-[#6B7280] px-4">{tasksInProgress.length}</span>
              </div>
              {tasksInProgress.map((tp: TaskProjectItem, index: number) => (
                <TaskKanban key={index} props={tp} />
              ))}
            </div>
            <div className="flex flex-col border border-[#FFE0E0] rounded-xl lg:w-[32%] w-full bg-white px-6 py-10 gap-5">
              <div className="flex gap-2 items-center mb-4">
                <h3 className="font-semibold text-xl">Terminées</h3>
                <span className="rounded-2xl bg-[#E5E7EB] text-[#6B7280] px-4">{tasksDone.length}</span>
              </div>
              {tasksDone.map((tp: TaskProjectItem, index: number) => (
                <TaskKanban key={index} props={tp} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
