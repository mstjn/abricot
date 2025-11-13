import { useEffect, useState } from "react";
import type { Project } from "../types";

export function useProjectsWithTasks() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const res = await fetch("/api/projects", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        setProjects(null);
        return;
      }

      const data: Project[] = await res.json();

      setProjects(data);
    } catch (err) {
      console.error("Erreur fetch assigned tasks:", err);
      setProjects(null);
    }
  }

  useEffect(() => {
    let active = true;

    async function load() {
      await refresh();
      if (active) setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return { projects, loading, refresh };
}
