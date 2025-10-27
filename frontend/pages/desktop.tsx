import React, { useState, useEffect } from 'react';
import DashboardVariation1Desktop from '../components/DashboardVariation1Desktop';
import DashboardVariation2Desktop from '../components/DashboardVariation2Desktop';
import DashboardVariation3Desktop from '../components/DashboardVariation3Desktop';
import { Monitor } from 'lucide-react';

export default function Desktop() {
  const [activeVariation, setActiveVariation] = useState<1 | 2 | 3>(1);

  const variations = [
    {
      id: 1,
      name: 'Unified Flow',
      description: 'Sidebar navigation with multi-column layout',
      component: DashboardVariation1Desktop,
    },
    {
      id: 2,
      name: 'Card Gallery',
      description: 'Visual-first with large grid displays',
      component: DashboardVariation2Desktop,
    },
    {
      id: 3,
      name: 'Action-Driven',
      description: 'Dashboard widgets with status panels',
      component: DashboardVariation3Desktop,
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
    <div className="min-h-screen bg-gray-100">
      {/* Variation Switcher - Fixed at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta to-sunset flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-serif font-semibold text-charcoal">
                  Desktop Dashboard Variations
                </h1>
                <p className="text-xs text-text-secondary">
                  Three unique approaches optimized for web browsers
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl">
              {variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setActiveVariation(variation.id as 1 | 2 | 3)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                    activeVariation === variation.id
                      ? 'bg-white text-charcoal shadow-md'
                      : 'text-text-secondary hover:text-charcoal hover:bg-white/50'
                  }`}
                >
                  <div className="text-sm font-semibold">{variation.name}</div>
                  <div className="text-xs opacity-70 mt-0.5">{variation.description}</div>
                </button>
              ))}
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="text-right">
              <p className="text-xs text-text-secondary mb-1">Keyboard shortcuts:</p>
              <div className="flex gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-charcoal">
                  1
                </span>
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-charcoal">
                  2
                </span>
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-charcoal">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content - Full Browser Viewport */}
      <div className="pt-[88px]">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
