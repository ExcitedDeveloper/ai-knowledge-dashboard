import React, { useState } from 'react';
import { Camera, Search, Folder, Sparkles, ChevronRight, Plus, Bell, BarChart3, Zap, Clock, CheckCircle2, AlertCircle, TrendingUp, Upload } from 'lucide-react';

// Dashboard Variation 3 Desktop: "Action-Driven"
// Philosophy: Dashboard-style with widgets, panels, and quick actions
// Top action bar, split view for files/results, status tracking
// Optimized for power users who want efficiency and quick task completion

const DashboardVariation3Desktop = () => {
  const [uploadedFiles] = useState([
    { id: 1, name: 'Living Room - North Wall', status: 'completed', progress: 100, date: 'Today, 2:45 PM' },
    { id: 2, name: 'Kitchen - Island View', status: 'processing', progress: 67, date: 'Today, 1:30 PM' },
    { id: 3, name: 'Bedroom - Morning Light', status: 'completed', progress: 100, date: 'Yesterday, 4:15 PM' },
    { id: 4, name: 'Bathroom - Spa Style', status: 'completed', progress: 100, date: 'Yesterday, 11:20 AM' },
    { id: 5, name: 'Dining Room - Evening', status: 'failed', progress: 0, date: '2 days ago' },
    { id: 6, name: 'Home Office - Desk', status: 'completed', progress: 100, date: '3 days ago' },
  ]);

  const [searchResults] = useState([
    { id: 1, title: 'Modern Minimalist Living', tags: ['Scandinavian', 'Light'], confidence: 'High', matchScore: 94 },
    { id: 2, title: 'Warm Bohemian Kitchen', tags: ['Eclectic', 'Cozy'], confidence: 'Medium', matchScore: 87 },
    { id: 3, title: 'Serene Bedroom Retreat', tags: ['Contemporary', 'Calm'], confidence: 'High', matchScore: 91 },
    { id: 4, title: 'Industrial Loft Space', tags: ['Modern', 'Urban'], confidence: 'Medium', matchScore: 85 },
    { id: 5, title: 'Coastal Living Room', tags: ['Beach', 'Airy'], confidence: 'High', matchScore: 89 },
    { id: 6, title: 'Rustic Farmhouse', tags: ['Rustic', 'Warm'], confidence: 'Medium', matchScore: 83 },
  ]);

  const stats = [
    { label: 'Total Uploads', value: '24', change: '+3', icon: Upload, color: 'terracotta' },
    { label: 'Designs Saved', value: '18', change: '+5', icon: Folder, color: 'sage' },
    { label: 'Matches Found', value: '156', change: '+12', icon: Sparkles, color: 'sunset' },
    { label: 'Active Projects', value: '6', change: '+2', icon: Zap, color: 'teal-deep' },
  ];

  return (
    <div className="flex h-screen bg-cream-soft">
      {/* Top Action Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-sand-warm z-20">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-serif font-semibold text-charcoal">ReSpace</h1>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gradient-to-r from-terracotta to-sunset text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Upload
              </button>
              <button className="px-4 py-2 bg-white border border-sand-warm text-text-secondary rounded-lg text-sm font-medium hover:border-terracotta transition-colors flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Quick search..."
                className="w-64 h-9 pl-10 pr-4 bg-cream-soft border border-sand-warm rounded-lg text-sm text-charcoal placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-lg hover:bg-sand-warm/50 flex items-center justify-center transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 pl-4 border-l border-sand-warm">
              <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-terracotta">JD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-16 overflow-y-auto">
        <div className="p-6">
          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 border border-sand-warm shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 text-${stat.color}`} />
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded-full">
                      <TrendingUp className="w-3 h-3 text-success" />
                      <span className="text-xs font-semibold text-success">{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-charcoal mb-1">{stat.value}</p>
                  <p className="text-xs text-text-secondary font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Files Panel - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-sand-warm shadow-sm overflow-hidden">
                {/* Panel Header */}
                <div className="px-5 py-4 border-b border-sand-warm bg-sand-warm/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
                      <Folder className="w-5 h-5 text-clay" />
                      My Spaces
                    </h3>
                    <button className="text-xs font-medium text-terracotta hover:text-terracotta-dark transition-colors">
                      View All
                    </button>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-terracotta text-white text-xs font-medium rounded-full shadow-sm">
                      All Files
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-sand-warm text-text-secondary text-xs font-medium rounded-full hover:border-terracotta transition-colors">
                      Completed
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-sand-warm text-text-secondary text-xs font-medium rounded-full hover:border-terracotta transition-colors">
                      Processing
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-sand-warm text-text-secondary text-xs font-medium rounded-full hover:border-terracotta transition-colors">
                      Failed
                    </button>
                  </div>
                </div>

                {/* Files List */}
                <div className="p-5">
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-sand-warm hover:border-terracotta/50 hover:bg-sand-warm/20 transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-terracotta/20 to-sage/20 flex-shrink-0"></div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal truncate mb-1">{file.name}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              {file.status === 'completed' && (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                  <span className="text-xs font-medium text-success">Completed</span>
                                </>
                              )}
                              {file.status === 'processing' && (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-warning border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-xs font-medium text-warning">Processing {file.progress}%</span>
                                </>
                              )}
                              {file.status === 'failed' && (
                                <>
                                  <AlertCircle className="w-3.5 h-3.5 text-error" />
                                  <span className="text-xs font-medium text-error">Failed</span>
                                </>
                              )}
                            </div>
                            <span className="text-xs text-text-tertiary">•</span>
                            <div className="flex items-center gap-1 text-xs text-text-tertiary">
                              <Clock className="w-3 h-3" />
                              {file.date}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-terracotta transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Upload Panel - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-sand-warm shadow-sm p-5 mb-6">
                <h3 className="text-sm font-semibold text-charcoal mb-4">Quick Upload</h3>
                <div className="bg-gradient-to-br from-terracotta/10 via-sunset/5 to-blush/10 border-2 border-dashed border-terracotta/30 rounded-xl p-6 text-center hover:border-terracotta hover:bg-terracotta/5 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6 text-terracotta" />
                  </div>
                  <p className="text-sm font-medium text-charcoal mb-1">Upload Photo</p>
                  <p className="text-xs text-text-secondary">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-xl border border-sand-warm shadow-sm p-5">
                <h3 className="text-sm font-semibold text-charcoal mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-charcoal font-medium mb-0.5">Upload completed</p>
                      <p className="text-xs text-text-tertiary">Living Room - North Wall</p>
                      <p className="text-xs text-text-tertiary mt-1">2 mins ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-warning mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-charcoal font-medium mb-0.5">Processing started</p>
                      <p className="text-xs text-text-tertiary">Kitchen - Island View</p>
                      <p className="text-xs text-text-tertiary mt-1">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-terracotta mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-charcoal font-medium mb-0.5">New matches found</p>
                      <p className="text-xs text-text-tertiary">12 design recommendations</p>
                      <p className="text-xs text-text-tertiary mt-1">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-error mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-charcoal font-medium mb-0.5">Upload failed</p>
                      <p className="text-xs text-text-tertiary">Dining Room - Evening</p>
                      <p className="text-xs text-text-tertiary mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Design Recommendations */}
          <div className="mt-6">
            <div className="bg-white rounded-xl border border-sand-warm shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-sand-warm bg-sand-warm/20">
                <h3 className="text-base font-semibold text-charcoal flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sunset" />
                  AI Design Recommendations
                </h3>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex gap-3 p-4 rounded-lg border border-sand-warm hover:border-terracotta/50 hover:bg-sand-warm/20 transition-all cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-terracotta/30 via-sunset/20 to-teal-deep/20 flex-shrink-0"></div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-charcoal truncate mb-2 group-hover:text-terracotta transition-colors">
                          {result.title}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {result.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-1 bg-sand-warm/50 text-clay rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            result.confidence === 'High'
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                          }`}>
                            {result.confidence}
                          </div>
                          <span className="text-xs font-semibold text-terracotta">{result.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardVariation3Desktop;
