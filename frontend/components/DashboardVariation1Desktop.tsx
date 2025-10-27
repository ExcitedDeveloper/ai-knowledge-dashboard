import React, { useState } from 'react';
import { Upload, Search, Image, FileText, Clock, X, Home, FolderOpen, Sparkles, Settings } from 'lucide-react';

// Dashboard Variation 1 Desktop: "Unified Flow"
// Philosophy: Clean multi-column layout with sidebar navigation
// Upload area in left panel, search and files in center, results on right or below
// Maintains vertical narrative but optimizes for horizontal screen space

const DashboardVariation1Desktop = () => {
  const [uploadedFiles] = useState([
    { id: 1, name: 'Living Room - North Wall', size: '2.4 MB', time: '2 mins ago', type: 'image' },
    { id: 2, name: 'Kitchen - Island View', size: '1.8 MB', time: '1 hour ago', type: 'image' },
    { id: 3, name: 'Bedroom - Morning Light', size: '3.1 MB', time: '3 hours ago', type: 'image' },
    { id: 4, name: 'Bathroom - Spa Style', size: '2.1 MB', time: '5 hours ago', type: 'image' },
    { id: 5, name: 'Dining Room - Evening', size: '2.8 MB', time: '1 day ago', type: 'image' },
  ]);

  const [searchResults] = useState([
    { id: 1, title: 'Modern Minimalist Living', style: 'Scandinavian', match: '94%', description: 'Clean lines and natural light' },
    { id: 2, title: 'Warm Bohemian Kitchen', style: 'Eclectic', match: '87%', description: 'Vibrant textures and earth tones' },
    { id: 3, title: 'Serene Bedroom Retreat', style: 'Contemporary', match: '91%', description: 'Calm palette with soft furnishings' },
    { id: 4, title: 'Industrial Loft Space', style: 'Modern Industrial', match: '85%', description: 'Exposed brick and metal accents' },
    { id: 5, title: 'Coastal Living Room', style: 'Beach House', match: '89%', description: 'Light blues and natural materials' },
    { id: 6, title: 'Rustic Farmhouse Kitchen', style: 'Farmhouse', match: '83%', description: 'Reclaimed wood and vintage elements' },
  ]);

  return (
    <div className="flex h-screen bg-cream-soft">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-sand-warm flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-semibold text-charcoal tracking-tight">
            ReSpace
          </h1>
          <p className="text-xs text-text-secondary mt-1">Your design journey</p>
        </div>

        <nav className="flex-1 px-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-terracotta/10 text-terracotta font-medium text-sm mb-1">
            <Home className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-sand-warm/50 transition-colors font-medium text-sm mb-1">
            <FolderOpen className="w-5 h-5" />
            My Spaces
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-sand-warm/50 transition-colors font-medium text-sm mb-1">
            <Sparkles className="w-5 h-5" />
            Inspiration
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-sand-warm/50 transition-colors font-medium text-sm">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-sand-warm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-terracotta">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">John Doe</p>
              <p className="text-xs text-text-secondary truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-semibold text-charcoal mb-2">
              Welcome back
            </h2>
            <p className="text-text-secondary">Transform your spaces with AI-powered design inspiration</p>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold tracking-wider uppercase text-clay mb-4">
                Upload Room Photo
              </label>
              <div className="bg-white border-2 border-dashed border-clay rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-200 hover:border-terracotta hover:bg-terracotta/5 cursor-pointer h-64">
                <div className="w-16 h-16 rounded-full bg-sand-warm flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-clay" />
                </div>
                <p className="text-sm font-medium text-charcoal mb-1">Click to upload</p>
                <p className="text-xs text-text-secondary text-center">or drag and drop your photo here</p>
                <p className="text-xs text-text-tertiary mt-3">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Search and Files Section */}
            <div className="lg:col-span-2">
              {/* Search */}
              <label className="block text-xs font-bold tracking-wider uppercase text-clay mb-4">
                Find Inspiration
              </label>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search styles, colors, rooms..."
                  className="w-full h-14 pl-12 pr-4 bg-white border-2 border-sand-warm rounded-xl text-base text-charcoal placeholder:text-text-tertiary focus:outline-none focus:border-terracotta transition-colors"
                />
              </div>

              {/* Files List */}
              <label className="block text-xs font-bold tracking-wider uppercase text-clay mb-4">
                Your Spaces
              </label>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white rounded-lg p-4 flex items-start gap-4 border border-sand-warm shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-lg bg-sand-warm flex items-center justify-center flex-shrink-0">
                      <Image className="w-7 h-7 text-clay" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{file.name}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-text-tertiary">{file.size}</span>
                        <span className="text-xs text-text-tertiary">•</span>
                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {file.time}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-sand-warm rounded-lg transition-colors">
                      <X className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section - Full Width */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs font-bold tracking-wider uppercase text-clay">
                Design Matches
              </label>
              <button className="text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-xl overflow-hidden border border-sand-warm shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                >
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-terracotta/20 via-sunset/15 to-sage/20 relative">
                    <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-md">
                      <span className="text-xs font-semibold text-terracotta">{result.match}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-charcoal mb-2 group-hover:text-terracotta transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-xs text-text-secondary mb-3">{result.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-clay bg-sand-warm/50 px-3 py-1.5 rounded-full">
                        {result.style}
                      </span>
                      <button className="text-xs font-medium text-terracotta hover:text-terracotta-dark transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardVariation1Desktop;
