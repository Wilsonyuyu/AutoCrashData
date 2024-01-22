"use client";

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const handleSearch = async () => {
    try {
      // Load the CSV file
      const response = await fetch('/2020.csv');
  
      // Check if the file was loaded successfully
      if (!response.ok) {
        throw new Error(`Failed to load CSV file (HTTP status: ${response.status})`);
      }
  
      // Parse the CSV data
      const csvData = await response.text();
      const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  
      // Implement search logic based on user input
      const results = parsedData.data.filter((row) => {
        const makeMatch = row.Make.toLowerCase().includes(searchTerm.toLowerCase());
        const modelMatch = row.Model.toLowerCase().includes(searchTerm.toLowerCase());
        return makeMatch || modelMatch;
      });
  
      // Check if there are results
      if (results.length > 0) {
        // Set the search result
        setSearchResult(JSON.stringify(results, null, 2));
      } else {
        // Handle the case when there are no results
        setSearchResult('No results found');
      }
    } catch (error) {
      // Handle errors, e.g., log or display an error message
      console.error('Error loading or parsing CSV file:', error.message);
      setSearchResult('Error loading or parsing CSV file');
    }
  };
  

  useEffect(() => {
    // Empty useEffect to make it a Client Component
  }, []);

  return (
    <main className="flex max-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl">AutoCrashData</h1>
        <h2 className="text-xl font-bold mb-4">Discover direct stats about automobiles crash</h2>
        <div className="flex justify-center items-center">
          <input
            type="text"
            placeholder="Search by Model or Make"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none text-black focus:border-blue-500"
          />
          <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
            Search
          </button>
        </div>
        <div className="mt-4">
          <pre>{searchResult}</pre>
        </div>
      </div>
    </main>
  );
}
