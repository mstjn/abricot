"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "../types";

interface Props {
  users: User[] | undefined;
  onSelect: (user: User) => void;
}

export default function AutocompleteTasks({ users, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.trim().length > 0
      ? users?.filter((u) => {
          const lower = query.toLowerCase();
          return (
            u.name?.toLowerCase().includes(lower) ||
            u.email.toLowerCase().includes(lower)
          );
        })
      : [];

  // Fermer la liste si on clique dehors
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative"  ref={containerRef}>
      <input
      id="assignes"
        type="text"
        className="border border-[#E5E7EB] rounded h-12 pl-2 text-[#6B7280] text-xs w-full"
        placeholder="Rechercher un utilisateur…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && (filtered?.length || 0) > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded mt-1 shadow-md max-h-48 overflow-y-auto z-20">
          {filtered?.map((user) => (
            <li
              key={user.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onSelect(user);
                setQuery("");
                setOpen(false);
              }}
            >
              <div>{user.name}</div>
            </li>
          ))}
        </ul>
      )}

      {open && query.length > 0 && !filtered?.length && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded mt-1 shadow-md max-h-48 overflow-y-auto z-20">
          <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">
            <div>Aucun résultat</div>
          </li>
        </ul>
      )}
    </div>
  );
}
