"use client";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ProjectCard from "../components/projectCard";
import { useProjects } from "../hooks/useProjects";
import { Project } from "../types";
export default function Page() {
  const { projects } = useProjects();
  console.log(projects);

  return (
    <>
      <Navbar dashboard={false} project={true} profile={false} />
      <main className="px-25 py-20 flex flex-col gap-10">
        <section className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-2xl">Mes projets</h1>
            <h2 className="text-lg">Gérer vos projets</h2>
          </div>
          <button className="text-white text-lg bg-[#1F1F1F] rounded-xl h-14 px-6">+ Créer un projet</button>
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
