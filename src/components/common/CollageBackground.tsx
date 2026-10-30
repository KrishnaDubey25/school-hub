import React, { useState } from 'react';

interface CollageBackgroundProps {
  className?: string;
  activeRoleHover?: 'admin' | 'school' | 'ngo' | null;
}

export const CollageBackground: React.FC<CollageBackgroundProps> = ({
  className = '',
  activeRoleHover = null,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | 'triptych'>('triptych');

  const photos = [
    {
      id: 'school',
      src: '/src/assets/images/school_classroom_students_1793261016320.jpg',
      label: 'GOV SCHOOL CLASSROOM',
      sub: 'Students & Faculty',
      role: 'school',
    },
    {
      id: 'admin',
      src: '/src/assets/images/hero_school_resource_hub_1793261016040.jpg',
      label: 'DISTRICT STEM & COMPUTING LAB',
      sub: 'Infrastructure & Equipment',
      role: 'admin',
    },
    {
      id: 'ngo',
      src: '/src/assets/images/ngo_donation_community_1793261017461.jpg',
      label: 'COMMUNITY & CSR DONATION',
      sub: 'Book & Kit Distribution',
      role: 'ngo',
    },
  ];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-black ${className}`}
    >
      {/* TRIPTYCH COLLAGE OF THREE AUTHENTIC PHOTOGRAPHS (100% UNBLURRED) */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 opacity-70 transition-opacity duration-700">
        {photos.map((photo, idx) => {
          const isHighlighted = activeRoleHover === photo.role;
          return (
            <div
              key={photo.id}
              className={`relative h-full w-full overflow-hidden transition-all duration-700 ${
                activeRoleHover
                  ? isHighlighted
                    ? 'opacity-100 scale-[1.02]'
                    : 'opacity-40 scale-[0.99]'
                  : 'opacity-85'
              }`}
            >
              <img
                src={photo.src}
                alt={photo.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter contrast-[1.12] brightness-[0.78] saturate-[0.95]"
              />

              {/* Individual panel atmospheric gradients - zero blur */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60" />

              {/* Refined subtle frame coordinates */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/50 uppercase">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                  {photo.label}
                </span>
                <span>PANEL 0{idx + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* LUXURY EDITORIAL OVERLAY SYSTEM (Zero blur, preserves photographic clarity) */}
      {/* 1. Deep cinematic radial vignette for dramatic contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.85)_100%)]" />

      {/* 2. Top-to-bottom master illumination gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-zinc-950/45 to-black/90" />

      {/* 3. Subtle fine geometric architectural grid line guides */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
};
