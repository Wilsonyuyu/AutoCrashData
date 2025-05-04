"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import makesList from '../util/constants.json';

// Reusable Components =======================

const OrDivider = () => (
  <div className="flex items-center w-full mb-8 mt-24">
    <div className="flex-1 h-px bg-gray-300" />
    <span className="text-4xl px-4 text-gray-500 font-large">OR</span>
    <div className="flex-1 h-px bg-gray-300" />
  </div>
);

const Dropdown = ({
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  className = '',
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) => (
  <select
    className={`border border-gray-300 px-6 py-4 focus:outline-none text-black/60 text-lg bg-white/70 shadow-md ${className}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
}: {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}) => (
  <div className="flex justify-center items-center w-full max-w-2xl">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 border border-gray-300 px-8 py-4 rounded-l-full focus:outline-none text-black/60 focus:border-blue-500 text-lg bg-white/70 placeholder:text-black/30 shadow-md"
      onKeyDown={(e) => e.key === 'Enter' && onSearch()}
    />
    <SearchButton onClick={onSearch} />
  </div>
);

const SearchButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="px-10 py-4 bg-blue-500/80 text-white/80 rounded-r-full text-lg shadow-md hover:bg-blue-600/90 transition-colors duration-200"
  >
    Search
  </button>
);

const PageHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <>
    <h1 className="text-6xl font-light text-white/80 mb-4">{title}</h1>
    <h2 className="text-2xl font-normal text-white/80 mb-2">{subtitle}</h2>
  </>
);

const DropdownSection = ({
  makes,
  models,
  selectedMake,
  selectedModel,
  onMakeChange,
  onModelChange,
}: {
  makes: string[];
  models: string[];
  selectedMake: string;
  selectedModel: string;
  onMakeChange: (make: string) => void;
  onModelChange: (model: string) => void;
}) => (
  <div className="flex flex-col items-center w-full max-w-2xl mt-8">
    <div className="flex w-full gap-4">
      <Dropdown
        value={selectedMake}
        options={makes}
        placeholder="Select Make"
        onChange={onMakeChange}
        className="flex-1 rounded-l-full"
      />
      <Dropdown
        value={selectedModel}
        options={models}
        placeholder="Select Model"
        onChange={onModelChange}
        disabled={!selectedMake}
        className="flex-1 rounded-r-full"
      />
    </div>
  </div>
);

// Main Component =============================

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [makeModelList, setMakeModelList] = useState<any[]>([]);
  const [makeOptions, setMakeOptions] = useState<string[]>([]);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  // Data initialization
  useEffect(() => {
    try {
      setMakeModelList(makesList.data);
      setMakeOptions(makesList.data.map((item: any) => item.make));
    } catch (error) {
      console.error('Failed to initialize vehicle data:', error);
    }
  }, []);

  // Model options update
  useEffect(() => {
    const updateModels = () => {
      if (!selectedMake) {
        setModelOptions([]);
        setSelectedModel('');
        return;
      }
      
      const selectedVehicle = makeModelList.find(
        (item) => item.make === selectedMake
      );
      setModelOptions(selectedVehicle?.models || []);
      setSelectedModel('');
    };

    updateModels();
  }, [selectedMake, makeModelList]);

  // Navigation handlers
  const handleNavigation = (path: string, params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    router.push(`${path}?${query}`);
  };

  const handleTextSearch = () => {
    if (searchTerm.trim()) {
      handleNavigation('/search', { query: searchTerm.trim() });
    }
  };

  // Auto-navigate when both selections are made
  useEffect(() => {
    if (selectedMake && selectedModel) {
      handleNavigation('/match', {
        make: selectedMake,
        model: selectedModel,
      });
    }
  }, [selectedMake, selectedModel, router]);

  return (
    <main className="flex max-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center h-screen">
        <PageHeader
          title="AutoCrashData"
          subtitle="Discover direct stats about automobile crashes"
        />

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleTextSearch}
          placeholder="Search by Model or Make"
        />

        <OrDivider />

        <DropdownSection
          makes={makeOptions}
          models={modelOptions}
          selectedMake={selectedMake}
          selectedModel={selectedModel}
          onMakeChange={setSelectedMake}
          onModelChange={setSelectedModel}
        />
      </div>
    </main>
  );
}