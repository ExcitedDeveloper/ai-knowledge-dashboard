import React, { useState } from 'react';
import { Camera, Search, Folder, Sparkles, ChevronRight, Plus } from 'lucide-react';

// Dashboard Variation 3: "Action-Driven"
// Philosophy: Quick actions and statusful organization.
// Emphasizes getting users to upload and explore quickly with prominent CTAs.
// Tabbed file organization and compact result cards for efficiency.

const DashboardVariation3 = () => {
  const [uploadedFiles] = useState([
    { id: 1, name: 'Living Room - North Wall', status: 'processed', date: 'Today' },
    { id: 2, name: 'Kitchen - Island View', status: 'processing', date: 'Today' },
    { id: 3, name: 'Bedroom - Morning Light', status: 'processed', date: 'Yesterday' },
  ]);

  const [searchResults] = useState([
    { id: 1, title: 'Modern Minimalist Living', tags: ['Scandinavian', 'Light'], confidence: 'High' },
    { id: 2, title: 'Warm Bohemian Kitchen', tags: ['Eclectic', 'Cozy'], confidence: 'Medium' },
    { id: 3, title: 'Serene Bedroom Retreat', tags: ['Contemporary', 'Calm'], confidence: 'High' },
  ]);

  return (
    <div className="w-full h-full bg-cream-soft overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[24px] font-serif font-semibold text-charcoal tracking-tight">
            Dashboard
          </h1>
          <button className="w-10 h-10 rounded-full bg-terracotta shadow-md flex items-center justify-center active:scale-95 transition-transform">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search designs"
            className="w-full h-[44px] pl-11 pr-4 bg-white border border-sand-warm rounded-lg text-sm text-charcoal placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
          />
        </div>
      </div>

      {/* Quick Upload CTA */}
      <div className="px-4 pb-5">
        <button className="w-full bg-gradient-to-r from-terracotta to-sunset rounded-xl p-4 shadow-md active:scale-[0.98] transition-transform flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Capture Your Space</p>
              <p className="text-white/80 text-xs">Upload and transform</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80" />
        </button>
      </div>

      {/* Files Section with Tabs */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-4 mb-3">
          <h3 className="text-sm font-semibold text-charcoal flex items-center gap-2">
            <Folder className="w-4 h-4 text-clay" />
            My Spaces
          </h3>
          <div className="flex-1 border-b border-sand-warm"></div>
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2 mb-3">
          <button className="px-3 py-1.5 bg-terracotta text-white text-xs font-medium rounded-full">
            All
          </button>
          <button className="px-3 py-1.5 bg-white border border-sand-warm text-text-secondary text-xs font-medium rounded-full">
            Processed
          </button>
          <button className="px-3 py-1.5 bg-white border border-sand-warm text-text-secondary text-xs font-medium rounded-full">
            Saved
          </button>
        </div>

        {/* Files List */}
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg p-3 border border-sand-warm shadow-sm active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gradient-to-br from-terracotta/20 to-sage/20 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        file.status === 'processed'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {file.status}
                    </span>
                    <span className="text-xs text-text-tertiary">{file.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="px-4 pb-8">
        <div className="flex items-center gap-4 mb-3">
          <h3 className="text-sm font-semibold text-charcoal flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            Recommended For You
          </h3>
          <div className="flex-1 border-b border-sand-warm"></div>
        </div>

        <div className="space-y-2.5">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl p-3 border border-sand-warm shadow-sm active:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                {/* Compact thumbnail */}
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-terracotta/20 via-sunset/20 to-sky/20 flex-shrink-0"></div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-charcoal leading-tight">{result.title}</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        result.confidence === 'High'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {result.confidence}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 bg-sand-warm text-clay rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardVariation3;
