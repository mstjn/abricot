"use client";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useProjectsWithTasks } from "./hooks/useProjectsWithTasks";
import { useUser } from "./userContext";
import Image from "next/image";
import { useState } from "react";
import TaskKanban from "./components/taskKanban";
import TaskList from "./components/taskList";
import type { TaskProjectItem } from "./types";

export default function HomePage() {
  const { projects, loading } = useProjectsWithTasks();
  const user = useUser();
  const [view, setView] = useState<boolean>(true);
  const tasksProjects: TaskProjectItem[] = [];
  const [search, setSearch] = useState<string>("");

  projects?.forEach((project) => {
    project.tasks.forEach((task) => {
      tasksProjects.push({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        commentsCount: task.comments.length,
        projectName: project.name,
      });
    });
  });

  const filteredTasks = tasksProjects.filter((task) => {
    const q = search.toLowerCase();
    return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q) || task.projectName.toLowerCase().includes(q);
  });

  const tasksToDo = tasksProjects.filter((task) => task.status === "TODO");
  const tasksInProgress = tasksProjects.filter((task) => task.status === "IN_PROGRESS");
  const tasksDone = tasksProjects.filter((task) => task.status === "DONE");



  if (loading) return <p>Chargement</p>;

  return (
    <>
      <Navbar dashboard={true} project={false} profile={false} />
      <main className="px-25 py-20 flex flex-col gap-10">
        <section className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-2xl">Tableau de bord</h1>
            <h2 className="text-lg">Bonjour {user?.name}, voici un aperçu de vos projets et tâches</h2>
          </div>
          <button className="text-white text-lg bg-[#1F1F1F] rounded-xl h-14 px-6">+ Créer un projet</button>
        </section>

        <section className="flex gap-5 mt-5">
          <a
            onClick={() => setView(true)}
            className={`cursor-pointer flex gap-3 ${view ? "bg-[#FFE8D9]" : "bg-white"} w-[6%] items-center justify-center rounded-lg py-3`}
          >
            <Image src="/list.svg" height={16} width={16} alt="Liste" />
            <p className="text-[#D3590B] text-md">Liste</p>
          </a>
          <a
            onClick={() => setView(false)}
            className={`cursor-pointer flex gap-3 ${view ? "bg-white" : "bg-[#FFE8D9]"} w-[6%] items-center justify-center rounded-lg py-3`}
          >
            <Image src="/kanban.svg" height={16} width={16} alt="Liste" />
            <p className=" text-[#D3590B] text-md">Kanban</p>
          </a>
        </section>

        {view ? (
          <section className="bg-white border border-[#E5E7EB] px-16 py-10 rounded-lg">
            <div className="flex justify-between mb-10">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-xl">Mes tâches assignées</h3>
                <p className="text-[#6B7280] text-lg">Par ordre de priorité</p>
              </div>

              <div className="border border-[#E5E7EB] flex gap-2 px-5 rounded-lg w-[23%] justify-between">
                <input type="text" className="w-full" placeholder="Rechercher une tâche" value={search} onChange={(e) => setSearch(e.target.value)} />
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
          <section className="flex justify-between">
            <div className="flex flex-col  border border-[#FFE0E0] rounded-xl bg-white w-[32%] px-6 py-10 gap-5">
              <div className="flex gap-2 items-center mb-4">
                <h3 className="font-semibold text-xl">À faire</h3>
                <span className="rounded-2xl bg-[#E5E7EB] text-[#6B7280] px-4">4</span>
              </div>
               {tasksToDo.map((tp: TaskProjectItem, index: number) => (
                <TaskKanban key={index} props={tp} />
              ))}
            </div>
            <div className="flex flex-col border border-[#FFE0E0] rounded-xl bg-white w-[32%] px-6 py-10 gap-5">
              <div className="flex gap-2 items-center mb-4">
                <h3 className="font-semibold text-xl">En cours</h3>
                <span className="rounded-2xl bg-[#E5E7EB] text-[#6B7280] px-4">4</span>
              </div>
              {tasksInProgress.map((tp: TaskProjectItem, index: number) => (
                <TaskKanban key={index} props={tp} />
              ))}
            </div>
            <div className="flex flex-col border border-[#FFE0E0] rounded-xl bg-white w-[32%] px-6 py-10 gap-5">
              <div className="flex gap-2 items-center mb-4">
                <h3 className="font-semibold text-xl">Terminées</h3>
                <span className="rounded-2xl bg-[#E5E7EB] text-[#6B7280] px-4">4</span>
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
