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

export default function MatchPage() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const queryMake = urlParams.get("make") || "";
    const queryModel = urlParams.get("model") || "";
    setMake(queryMake);
    setModel(queryModel);

    if (!queryMake || !queryModel) return;

    setLoading(true);
    setError("");

    try {
      // Find the make group based on the query make
      const makeGroup = (data.data as MakeGroup[]).find(group => group.make === queryMake);
      if (makeGroup) {
        // Find the model data within the make group
        const match = makeGroup.models.find(m => m.model === queryModel)?.data || null;
        setResult(match);
      } else {
        setResult(null); // No make found
      }
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array to run only on mount

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-8 bg-white/90">
      <h1 className="text-4xl font-light text-black/70 mb-6">
        Match Result for: <span className="font-normal">{make} {model}</span>
      </h1>
      {loading && <div className="text-lg text-black/50">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        result ? (
          <pre className="text-black/80">{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <div className="text-black/50 text-xl">No match found.</div>
        )
      )}
    </main>
  );
} 