"use client";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ProjectCard from "../components/projectCard";
import { useProjects } from "../hooks/useProjects";
import { Project } from "../types";
import { createPortal } from "react-dom";
import ModalCreateProject from "../components/modalCreateProject";
import { useState } from "react";
export default function Page() {
  const { projects, refresh } = useProjects();
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Navbar dashboard={false} project={true} profile={false} />
      <main className="xl:px-25 lg:px-15 px-5 py-20 flex flex-col gap-10">
        <section className="flex lg:flex-row flex-col justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-2xl">Mes projets</h1>
            <h2 className="text-lg mb-5 lg:mb-0">Gérer vos projets</h2>
          </div>
           <button className="text-white text-lg bg-[#1F1F1F] rounded-xl h-14 px-6" onClick={() => setShowModal(true)}>+ Créer un projet</button>
                   {showModal && createPortal(<ModalCreateProject closeModal={() => setShowModal(false)}  onSuccess={() => {
                  refresh();           
                  setShowModal(false);  
                }} />, document.body)}
        </section>
        <section className="flex flex-wrap gap-5">
          {projects?.map((project: Project, index: number) => (
            <ProjectCard key={index} props={project} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
