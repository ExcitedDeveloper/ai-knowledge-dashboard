import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardVariation1 from '../components/DashboardVariation1';
import DashboardVariation2 from '../components/DashboardVariation2';
import DashboardVariation3 from '../components/DashboardVariation3';
import { Monitor, ArrowLeft } from 'lucide-react';

export default function Compare() {
  const [activeVariation, setActiveVariation] = useState<1 | 2 | 3>(1);

  const variations = [
    {
      id: 1,
      name: 'Unified Flow',
      description: 'Vertical narrative, clear hierarchy, generous spacing',
      component: DashboardVariation1,
    },
    {
      id: 2,
      name: 'Card Gallery',
      description: 'Visual-first, gallery browsing, engagement metrics',
      component: DashboardVariation2,
    },
    {
      id: 3,
      name: 'Action-Driven',
      description: 'Efficiency-focused, quick actions, tabbed organization',
      component: DashboardVariation3,
    },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1') setActiveVariation(1);
      if (e.key === '2') setActiveVariation(2);
      if (e.key === '3') setActiveVariation(3);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const ActiveComponent = variations.find((v) => v.id === activeVariation)?.component;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Navigation Links */}
        <div className="flex gap-3 mb-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/80 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </Link>
          <Link
            href="/desktop"
            className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors shadow-lg"
          >
            <Monitor className="w-4 h-4" />
            Desktop View
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex gap-2">
          {variations.map((variation) => (
            <button
              key={variation.id}
              onClick={() => setActiveVariation(variation.id as 1 | 2 | 3)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeVariation === variation.id
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="text-sm font-semibold">{variation.name}</div>
              <div className="text-xs opacity-70 mt-0.5">{variation.description}</div>
            </button>
          ))}
        </div>

        {/* iPhone Frame with Active Variation */}
        <div className="relative bg-gray-800 rounded-[40px] p-3 shadow-2xl">
          <div className="relative bg-black rounded-[32px] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

            {/* Screen */}
            <div className="w-[390px] h-[844px] bg-white overflow-hidden">
              {ActiveComponent && <ActiveComponent />}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="text-white/50 text-sm text-center">
          <p>Use keyboard: <span className="font-mono bg-white/10 px-2 py-1 rounded">1</span> <span className="font-mono bg-white/10 px-2 py-1 rounded">2</span> <span className="font-mono bg-white/10 px-2 py-1 rounded">3</span> to switch</p>
        </div>
      </div>
    </div>
  );
}
