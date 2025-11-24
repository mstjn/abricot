"use client";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import { useProjects } from "@/app/hooks/useProjects";
import { useProjectsTasks } from "@/app/hooks/useProjectsTasks";
import { Project } from "@/app/types";
import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TaskCard from "@/app/components/taskCard";
import { ComboboxDemo } from "@/app/components/comboboxDemo";
import { createPortal } from "react-dom";
import ModalUpdateProject from "@/app/components/modalUpdateProject";


export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { tasks } = useProjectsTasks(slug);
  const { projects } = useProjects();
  const [view, setView] = useState(true);
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false)

 
  // input filter
const filteredTasks = tasks?.filter((task) => {
  const q = search.toLowerCase();

  const matchSearch =
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q);

  const matchStatus =
    !selectedStatus || task.status === selectedStatus;

  return matchSearch && matchStatus;
});


  const getInitials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";

  const projet: Project[] | undefined = projects?.filter((p) => p.id === slug);
  const memberInitials = projet?.[0].members.map((m) => getInitials(m.user?.name));
  const members = projet?.[0].members.map((m) => m.user?.name);
  const ownerInitials = getInitials(projet?.[0].owner?.name);


  const statuts = [
  {
    value: "TODO",
    label: "À faire",
  },
  {
    value: "IN_PROGRESS",
    label: "En cours",
  },
  {
    value: "DONE",
    label: "Terminée",
  },
  {
    value: "CANCELLED",
    label: "Annulée"
  }
]

  return (
    <>
      <Navbar dashboard={false} project={true} profile={false} />
      <main className="px-25 py-20 flex flex-col gap-10">
        <section className="flex justify-between">
          <div className="flex gap-5 items-center">
            <Link className="bg-white border p-5 rounded-xl border-[#E5E7EB]" href="/projects">
              <Image src="/arrow.svg" height={15} width={15} alt="arrow" />
            </Link>
            <div className="flex flex-col gap-2">
              <div className="flex gap-5 items-center">
                <h1 className="font-semibold text-2xl">{projet?.[0].name}</h1>
                <u className="text-[#D3590B] cursor-pointer" onClick={() => setShowModal(true)}>Modifier</u>
                {showModal && createPortal(<ModalUpdateProject closeModal={() => setShowModal(false)}/>, document.body)}
              </div>
              <h2 className="text-lg">{projet?.[0].description}</h2>
            </div>
          </div>
          <div className="flex gap-5">
            <button className="text-white text-lg bg-[#1F1F1F] rounded-xl h-14 px-6">Créer une tâche</button>

            <button className="text-white text-lg bg-[#D3590B] rounded-xl h-14 px-6 flex justify-center items-center gap-2">
              <Image src="/ia.svg" width={15} height={15} alt="ia" />
              IA
            </button>
          </div>
        </section>
        <section className="bg-[#F3F4F6] flex justify-between rounded-xl px-12 py-5">
          <div className="flex gap-5 items-baseline">
            <h2 className="text-xl font-semibold">Contributeurs</h2>
            <p className="text-[#6B7280]">{1 + (memberInitials?.length || 0)} personnes</p>
          </div>
          <div className="flex items-center">
            <span className="bg-[#FFE8D9] p-2 rounded-full  text-xs  mr-2">{ownerInitials}</span>
            <span className="bg-[#FFE8D9] px-2 py-1 rounded-full  text-[#D3590B] mr-2">Propriétaire</span>
            {memberInitials?.map((member: string, index: number) => (
              <div key={index}>
                <span className="bg-[#E5E7EB] p-2 rounded-full border border-white text-xs  mr-2">{member}</span>
                <span className="bg-[#E5E7EB] px-2 py-1 rounded-full mr-5">{members?.[index]}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white border border-[#E5E7EB] px-16 py-10 rounded-xl">
          <div className="flex justify-between mb-10">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-xl">Tâches</h3>
              <p className="text-[#6B7280] text-lg">Par ordre de priorité</p>
            </div>
            <div className="flex gap-10 justify-end items-center">
              <div className="flex gap-5">
                <a
                  onClick={() => setView(true)}
                  className={`cursor-pointer flex gap-3 ${view ? "bg-[#FFE8D9]" : "bg-white"} w-30 items-center justify-center rounded-lg h-12`}
                >
                  <Image src="/list.svg" height={16} width={16} alt="Liste" />
                  <p className="text-[#D3590B] text-md">Liste</p>
                </a>
                <a
                  onClick={() => setView(false)}
                  className={`cursor-pointer flex gap-3 ${view ? "bg-white" : "bg-[#FFE8D9]"} w-30 items-center justify-center rounded-lg h-12`}
                >
                  <Image src="/kanban.svg" height={16} width={16} alt="Liste" />
                  <p className=" text-[#D3590B] text-md">Calendrier</p>
                </a>
              </div>

             <ComboboxDemo statuts={statuts} setSelectedStatus={setSelectedStatus} />


              <div className="border border-[#E5E7EB] flex gap-2 px-8 rounded-xl h-16  justify-between">
                <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="w-full" placeholder="Rechercher une tâche" />
                <Image src="/search.svg" height={15} width={15} alt="search" />
              </div>
            </div>
          </div>


          <div className="flex flex-col gap-5 px-10">

            {filteredTasks?.map((task, index) => <TaskCard getInitials={getInitials} task={task} key={index} />)}
            
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
