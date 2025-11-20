import type { User, ProfileResponse, AssignedTasksResponse, Task, ProjectsResponse, Project } from "../types";
import { cookies } from "next/headers";


// retrieve profile data
export const getProfile = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch("http://localhost:8000/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data: ProfileResponse = await res.json();
    return data?.data?.user ?? null;
  } catch (err) {
    console.error("Erreur lors de la récupération du profil :", err);
    return null;
  }
};

// retrieve assigned tasks to user
export const getAssignedTasksByUser = async (token: string | undefined): Promise<Task[] | null> => {
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:8000/dashboard/assigned-tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: AssignedTasksResponse = await res.json();

    return data.data.tasks ?? null;
  } catch (err) {
    console.error("Erreur lors de la récupération des tâches assignées :", err);
    return null;
  }
};


// retrieve the projects to which the user has assigned tasks
export const getProjectsWithTasks = async (token: string | undefined): Promise<Project[] | null> => {
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:8000/dashboard/projects-with-tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: ProjectsResponse = await res.json();

    return data.data.projects ?? null;
  } catch (err) {
    console.error("Erreur lors de la récupération des projets :", err);
    return null;
  }
};


// retrieve all of the user's projects
export const getProjects = async (token: string | undefined): Promise<Project[] | null> => {
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:8000/projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: ProjectsResponse = await res.json();
    
  
    return data.data.projects ?? null;
  } catch (err) {
    console.error("Erreur lors de la récupération des projets :", err);
    return null;
  }
};


// retrieve all of the project's taks
export const getProjectsTasks = async (token : string | undefined, projectID : string): Promise<Task[] | null> => {

  if (!token) return null;

  try {
    const res = await fetch(`http://localhost:8000/projects/${projectID}/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: AssignedTasksResponse = await res.json();
    
  
    return data.data.tasks ?? null;
  } catch (err) {
    console.error("Erreur lors de la récupération des projets :", err);
    return null;
  }
};