"use client";

import { useState, useEffect } from "react";
import { User } from "../types";

export default function AutocompleteUsers({ onSelect }: { onSelect: (user: User) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      const res = await fetch(`/api/search?query=${query}`);

      const data = await res.json();
      console.log(data);

      setResults(data);
    };

    const delay = setTimeout(fetchUsers, 250);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        className="border border-[#E5E7EB] rounded h-12 pl-2 w-full text-xs text-gray-600"
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 150)}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Liste de résultats */}
      {showList && results.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-52 overflow-y-auto">
          {results.map((user) => (
            <button
              key={user.id}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              onClick={() => {
                onSelect(user);
                setQuery("");
              }}
            >
              {user.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
