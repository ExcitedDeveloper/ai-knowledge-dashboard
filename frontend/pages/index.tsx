import React from 'react';
import Link from 'next/link';
import DashboardVariation1 from '../components/DashboardVariation1';
import DashboardVariation2 from '../components/DashboardVariation2';
import DashboardVariation3 from '../components/DashboardVariation3';
import { Monitor, Smartphone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
                ReSpace Dashboard Designs
              </h1>
              <p className="text-lg text-text-secondary">
                Three unique approaches to the interior design dashboard
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/compare"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-sand-warm text-text-secondary rounded-lg text-sm font-medium hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                Mobile Compare
              </Link>
              <Link
                href="/desktop"
                className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors shadow-md"
              >
                <Monitor className="w-4 h-4" />
                Desktop View
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              <strong>Mobile Designs:</strong> Viewing iPhone-sized variations. Switch to{' '}
              <Link href="/desktop" className="underline font-semibold hover:text-blue-900">
                Desktop View
              </Link>{' '}
              for web browser layouts.
            </p>
          </div>
        </div>

        {/* Row 1: All Three Variations */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">
            Dashboard Variations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Variation 1 */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-charcoal mb-1">
                  Variation 1: Unified Flow
                </h3>
                <p className="text-sm text-text-secondary">
                  Vertical narrative with generous spacing and clear section hierarchy
                </p>
              </div>
              <div className="relative bg-gray-900 rounded-[40px] p-3 shadow-2xl">
                {/* iPhone Frame */}
                <div className="relative bg-black rounded-[32px] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

                  {/* Screen */}
                  <div className="w-[390px] h-[844px] bg-white overflow-hidden">
                    <DashboardVariation1 />
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Variation 2 */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-charcoal mb-1">
                  Variation 2: Card Gallery
                </h3>
                <p className="text-sm text-text-secondary">
                  Visual-first with prominent upload and grid-based file organization
                </p>
              </div>
              <div className="relative bg-gray-900 rounded-[40px] p-3 shadow-2xl">
                {/* iPhone Frame */}
                <div className="relative bg-black rounded-[32px] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

                  {/* Screen */}
                  <div className="w-[390px] h-[844px] bg-white overflow-hidden">
                    <DashboardVariation2 />
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Variation 3 */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-charcoal mb-1">
                  Variation 3: Action-Driven
                </h3>
                <p className="text-sm text-text-secondary">
                  Quick actions, tabbed organization, and prominent CTAs
                </p>
              </div>
              <div className="relative bg-gray-900 rounded-[40px] p-3 shadow-2xl">
                {/* iPhone Frame */}
                <div className="relative bg-black rounded-[32px] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

                  {/* Screen */}
                  <div className="w-[390px] h-[844px] bg-white overflow-hidden">
                    <DashboardVariation3 />
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design Philosophy */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-serif font-semibold text-charcoal mb-4">
            Design Philosophy
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-charcoal mb-2">Variation 1: Unified Flow</h4>
              <p className="text-text-secondary leading-relaxed">
                Emphasizes simplicity and cognitive ease. All sections flow vertically in a natural
                narrative: upload → review files → search → explore results. Generous spacing and
                clear labels reduce cognitive load.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal mb-2">Variation 2: Card Gallery</h4>
              <p className="text-text-secondary leading-relaxed">
                Visual-first approach that treats the interface like a curated gallery. Large,
                beautiful upload card invites action. Grid-based file display and rich result cards
                with engagement metrics create an inspiring browsing experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal mb-2">Variation 3: Action-Driven</h4>
              <p className="text-text-secondary leading-relaxed">
                Focuses on efficiency and quick actions. Prominent gradient CTA, tabbed file
                organization for filtering, and compact result cards with status indicators help
                users accomplish tasks quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
