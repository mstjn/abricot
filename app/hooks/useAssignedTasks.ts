import { useEffect, useState } from "react";
import type { Task } from "../types";

export function useAssignedTasks() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const res = await fetch("/api/assigned-tasks-api", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        setTasks(null);
        return;
      }

      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Erreur fetch assigned tasks:", err);
      setTasks(null);
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

  return { tasks, loading, refresh };
}
