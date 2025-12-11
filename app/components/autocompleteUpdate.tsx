"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "../types";

export default function AutocompleteUpdate({
  onSelect,
}: {
  onSelect: (user: User) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close autocomplete list
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);

      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json();

      setResults(data.data.users ?? []);
      setLoading(false);
    };

    const delay = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (user: User) => {
    onSelect(user);
    setQuery("");
    setShowList(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
      id="assignes"
        type="text"
        placeholder="Ajouter un contributeur..."
        className="border border-[#E5E7EB] rounded h-12 pl-2 w-full text-xs text-gray-600"
        onFocus={() => setShowList(true)}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {showList && query.length > 1 &&(
        <div className="absolute z-20 w-full bg-white border rounded shadow mt-1 max-h-52 overflow-y-auto">

          {loading && (
            <p className="px-3 py-2 text-xs text-gray-400">Recherche...</p>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-400">
              Aucun utilisateur trouvé
            </p>
          )}

          {!loading &&
            results.map((user) => (
              <button
                key={user.id}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                onClick={() => handleSelect(user)}
              >
                {user.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
