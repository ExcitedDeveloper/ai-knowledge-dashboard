import React, { useState } from 'react';
import { Upload, Search, Image, Heart, Eye, TrendingUp, Filter, Grid3x3, Star, BookmarkPlus } from 'lucide-react';

// Dashboard Variation 2 Desktop: "Card Gallery"
// Philosophy: Visual-first gallery experience optimized for larger screens
// Large hero upload section, 3-4 column grid for files and results
// Emphasizes beautiful imagery and social engagement metrics

const DashboardVariation2Desktop = () => {
  const [uploadedFiles] = useState([
    { id: 1, name: 'Living Room', time: '2m ago', views: '145' },
    { id: 2, name: 'Kitchen', time: '1h ago', views: '89' },
    { id: 3, name: 'Bedroom', time: '3h ago', views: '234' },
    { id: 4, name: 'Bathroom', time: '5h ago', views: '67' },
    { id: 5, name: 'Dining Room', time: '1d ago', views: '178' },
    { id: 6, name: 'Home Office', time: '2d ago', views: '203' },
    { id: 7, name: 'Patio', time: '3d ago', views: '156' },
    { id: 8, name: 'Guest Room', time: '4d ago', views: '92' },
  ]);

  const [searchResults] = useState([
    { id: 1, title: 'Modern Minimalist', views: '2.4k', likes: '89', rating: 4.8 },
    { id: 2, title: 'Warm Bohemian', views: '1.8k', likes: '124', rating: 4.6 },
    { id: 3, title: 'Serene Retreat', views: '3.2k', likes: '156', rating: 4.9 },
    { id: 4, title: 'Industrial Loft', views: '2.1k', likes: '98', rating: 4.7 },
    { id: 5, title: 'Coastal Living', views: '2.8k', likes: '142', rating: 4.8 },
    { id: 6, title: 'Rustic Farmhouse', views: '1.5k', likes: '76', rating: 4.5 },
    { id: 7, title: 'Art Deco Elegance', views: '1.9k', likes: '103', rating: 4.6 },
    { id: 8, title: 'Scandinavian Chic', views: '3.5k', likes: '189', rating: 4.9 },
  ]);

  return (
    <div className="min-h-screen bg-cream-soft">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-sand-warm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-serif font-semibold text-charcoal tracking-tight">
                ReSpace
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <button className="text-sm font-medium text-terracotta border-b-2 border-terracotta pb-1">
                  Gallery
                </button>
                <button className="text-sm font-medium text-text-secondary hover:text-charcoal transition-colors">
                  My Uploads
                </button>
                <button className="text-sm font-medium text-text-secondary hover:text-charcoal transition-colors">
                  Trending
                </button>
                <button className="text-sm font-medium text-text-secondary hover:text-charcoal transition-colors">
                  Collections
                </button>
              </nav>
            </div>

            {/* Top Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search designs, styles..."
                  className="w-80 h-10 pl-11 pr-4 bg-cream-soft border border-sand-warm rounded-full text-sm text-charcoal placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center cursor-pointer">
                <span className="text-sm font-semibold text-terracotta">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Hero Upload Section */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-terracotta/20 via-sunset/15 to-blush/20 rounded-3xl p-12 border border-terracotta/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-terracotta/10 to-transparent rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h2 className="text-4xl font-serif font-semibold text-charcoal mb-3">
                    Transform Your Space
                  </h2>
                  <p className="text-lg text-text-secondary mb-6">
                    Upload a photo of your room and discover AI-powered design inspiration tailored to your style
                  </p>
                  <button className="px-8 py-4 bg-terracotta text-white rounded-full text-base font-medium shadow-lg hover:bg-terracotta-dark hover:shadow-xl transition-all flex items-center gap-3">
                    <Upload className="w-5 h-5" />
                    Upload Room Photo
                  </button>
                </div>
                <div className="w-40 h-40 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center">
                  <Image className="w-20 h-20 text-terracotta/40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Spaces Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif font-semibold text-charcoal">Your Spaces</h3>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-sand-warm rounded-lg text-sm font-medium text-text-secondary hover:border-terracotta transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-sand-warm rounded-lg text-sm font-medium text-text-secondary hover:border-terracotta transition-colors">
                <Grid3x3 className="w-4 h-4" />
                Grid View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="group cursor-pointer"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-sage/20 to-sand-warm overflow-hidden border border-sand-warm shadow-sm hover:shadow-lg transition-all relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="w-16 h-16 text-clay/40 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-sm font-semibold drop-shadow-lg">{file.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-white/90 text-xs drop-shadow-lg">{file.time}</p>
                      <div className="flex items-center gap-1 text-white/90 text-xs drop-shadow-lg">
                        <Eye className="w-3 h-3" />
                        {file.views}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Designs Gallery */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-serif font-semibold text-charcoal">Trending Designs</h3>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-sunset/10 border border-sunset/30 rounded-full">
                <TrendingUp className="w-4 h-4 text-sunset" />
                <span className="text-xs font-medium text-sunset">Popular</span>
              </div>
            </div>
            <button className="text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors">
              Explore All Designs
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="h-56 bg-gradient-to-br from-terracotta/30 via-sunset/20 to-teal-deep/20 relative overflow-hidden">
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <BookmarkPlus className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="text-base font-semibold text-charcoal mb-3 group-hover:text-terracotta transition-colors">
                    {result.title}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {result.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {result.likes}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-sunset fill-sunset" />
                      <span className="text-xs font-semibold text-charcoal">{result.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardVariation2Desktop;
