import React, { useState } from 'react';
import { Upload, Search, Image, Heart, Eye, TrendingUp } from 'lucide-react';

// Dashboard Variation 2: "Card Gallery"
// Philosophy: Visual-first approach with card-based organization.
// Large upload card takes center stage, files display as image thumbnails,
// search and results feel like browsing a curated gallery.

const DashboardVariation2 = () => {
  const [uploadedFiles] = useState([
    { id: 1, name: 'Living Room', time: '2m ago' },
    { id: 2, name: 'Kitchen', time: '1h ago' },
    { id: 3, name: 'Bedroom', time: '3h ago' },
    { id: 4, name: 'Bathroom', time: '5h ago' },
  ]);

  const [searchResults] = useState([
    { id: 1, title: 'Modern Minimalist', views: '2.4k', likes: '89' },
    { id: 2, title: 'Warm Bohemian', views: '1.8k', likes: '124' },
    { id: 3, title: 'Serene Retreat', views: '3.2k', likes: '156' },
  ]);

  return (
    <div className="w-full h-full bg-cream-soft overflow-y-auto hide-scrollbar">
      {/* Header with Search */}
      <div className="px-4 pt-8 pb-6">
        <h1 className="text-[28px] font-serif font-semibold text-charcoal tracking-tight mb-6">
          ReSpace
        </h1>

        {/* Integrated Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search designs, styles..."
            className="w-full h-[48px] pl-12 pr-4 bg-white border-[1.5px] border-sand-warm rounded-full text-base text-charcoal placeholder:text-text-tertiary focus:outline-none focus:border-terracotta shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Large Upload Card */}
      <div className="px-4 pb-6">
        <div className="bg-gradient-to-br from-sunset/10 via-terracotta/10 to-blush/10 rounded-2xl p-6 border border-terracotta/20 active:scale-[0.98] transition-transform">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
              <Upload className="w-10 h-10 text-terracotta" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">Upload Room Photo</h2>
            <p className="text-sm text-text-secondary mb-4 max-w-[240px]">
              Capture your space and let AI reimagine it
            </p>
            <button className="px-6 py-2.5 bg-terracotta text-white rounded-full text-sm font-medium shadow-md active:scale-95 transition-transform">
              Choose Photo
            </button>
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="px-4 pb-6">
        <h3 className="text-sm font-semibold text-charcoal mb-3">Your Spaces</h3>
        <div className="grid grid-cols-2 gap-3">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="aspect-square rounded-xl bg-gradient-to-br from-sage/20 to-sand-warm overflow-hidden border border-sand-warm shadow-sm active:shadow-md transition-shadow relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image className="w-12 h-12 text-clay/40" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-xs font-medium">{file.name}</p>
                <p className="text-white/70 text-[10px]">{file.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="px-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-charcoal">Trending Designs</h3>
          <button className="text-xs font-medium text-teal-deep flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            View All
          </button>
        </div>
        <div className="space-y-3">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm active:shadow-md transition-shadow"
            >
              {/* Image with gradient overlay */}
              <div className="h-40 bg-gradient-to-br from-terracotta/30 via-sunset/20 to-teal-deep/20 relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Eye className="w-3 h-3 text-text-secondary" />
                    <span className="text-xs text-text-secondary">{result.views}</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3 text-terracotta fill-terracotta" />
                    <span className="text-xs text-text-secondary">{result.likes}</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-charcoal">{result.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardVariation2;
