"use client";

import React, { useEffect, useState } from "react";
import data from '../../data/2020/data.json';

interface MakeGroup {
  make: string;
  summary: {
    modelCount: number;
    totalExposure: number;
    averageOverall: number | null;
  };
  models: { model: string; data: any }[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get("query") || "";
    setQuery(q);
    if (!q) return;
    setLoading(true);
    setError("");
    try {
      // Flatten all models into a single array of data rows
      const allRows = (data.data as MakeGroup[]).flatMap((makeGroup) =>
        makeGroup.models.map((m) => m.data)
      );
      const filtered = allRows.filter((row) => {
        const makeMatch = row.Make?.toLowerCase().includes(q.toLowerCase());
        const modelMatch = row.Model?.toLowerCase().includes(q.toLowerCase());
        return makeMatch || modelMatch;
      });
      setResults(filtered);
      setLoading(false);
    } catch {
      setError("Failed to load data");
      setLoading(false);
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-8 bg-white/90">
      <h1 className="text-4xl font-light text-black/70 mb-6">Search Results for: <span className="font-normal">{query}</span></h1>
      {loading && <div className="text-lg text-black/50">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="w-full max-w-3xl">
          {results.length === 0 ? (
            <div className="text-black/50 text-xl">No results found.</div>
          ) : (
            <table className="w-full border-collapse mt-4 bg-white/80 shadow rounded-lg">
              <thead>
                <tr>
                  {Object.keys(results[0] || {}).map((key) => (
                    <th key={key} className="px-4 py-2 text-left text-black/60 border-b">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-4 py-2 text-black/80 border-b">{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
} 
