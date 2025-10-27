import React, { useState } from 'react';
import { Upload, Search, Image, FileText, Clock, X } from 'lucide-react';

// Dashboard Variation 1: "Unified Flow"
// Philosophy: All actions flow vertically in a single, scrollable stream.
// Upload → Files → Search → Results creates a natural narrative progression.
// Emphasizes simplicity and cognitive ease with generous spacing.

const DashboardVariation1 = () => {
  const [uploadedFiles] = useState([
    { id: 1, name: 'Living Room - North Wall', size: '2.4 MB', time: '2 mins ago', type: 'image' },
    { id: 2, name: 'Kitchen - Island View', size: '1.8 MB', time: '1 hour ago', type: 'image' },
    { id: 3, name: 'Bedroom - Morning Light', size: '3.1 MB', time: '3 hours ago', type: 'image' },
  ]);

  const [searchResults] = useState([
    { id: 1, title: 'Modern Minimalist Living', style: 'Scandinavian', match: '94%' },
    { id: 2, title: 'Warm Bohemian Kitchen', style: 'Eclectic', match: '87%' },
    { id: 3, title: 'Serene Bedroom Retreat', style: 'Contemporary', match: '91%' },
  ]);

  return (
    <div className="w-full h-full bg-cream-soft overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <h1 className="text-[28px] font-serif font-semibold text-charcoal tracking-tight mb-1">
          ReSpace
        </h1>
        <p className="text-sm text-text-secondary">Your design journey starts here</p>
      </div>

      {/* Upload Section */}
      <div className="px-4 pb-6">
        <label className="block text-[11px] font-bold tracking-[0.8px] uppercase text-clay mb-3">
          Upload Room Photo
        </label>
        <div className="bg-white border-2 border-dashed border-clay rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-200 active:scale-[0.98]">
          <div className="w-16 h-16 rounded-full bg-sand-warm flex items-center justify-center mb-3">
            <Upload className="w-8 h-8 text-clay" />
          </div>
          <p className="text-sm font-medium text-charcoal mb-1">Tap to upload</p>
          <p className="text-xs text-text-secondary">or drag and drop your photo</p>
        </div>
      </div>

      {/* Files List */}
      <div className="px-4 pb-6">
        <label className="block text-[11px] font-bold tracking-[0.8px] uppercase text-clay mb-3">
          Your Spaces
        </label>
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg p-3 flex items-start gap-3 border border-sand-warm shadow-sm active:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-md bg-sand-warm flex items-center justify-center flex-shrink-0">
                <Image className="w-6 h-6 text-clay" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-tertiary">{file.size}</span>
                  <span className="text-xs text-text-tertiary">•</span>
                  <span className="text-xs text-text-tertiary flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {file.time}
                  </span>
                </div>
              </div>
              <button className="p-1.5 hover:bg-sand-warm rounded-full transition-colors">
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="px-4 pb-6">
        <label className="block text-[11px] font-bold tracking-[0.8px] uppercase text-clay mb-3">
          Find Inspiration
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search styles, colors, rooms..."
            className="w-full h-[52px] pl-12 pr-4 bg-white border-[1.5px] border-sand-warm rounded-xl text-base text-charcoal placeholder:text-text-tertiary focus:outline-none focus:border-terracotta transition-colors"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="px-4 pb-8">
        <label className="block text-[11px] font-bold tracking-[0.8px] uppercase text-clay mb-3">
          Design Matches
        </label>
        <div className="space-y-3">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl overflow-hidden border border-sand-warm shadow-sm active:shadow-md transition-shadow"
            >
              {/* Image placeholder with gradient */}
              <div className="h-32 bg-gradient-to-br from-terracotta/20 to-sage/20 relative">
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-sage">{result.match} match</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-charcoal mb-1">{result.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-sand-warm text-clay rounded-full font-medium">
                    {result.style}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardVariation1;
