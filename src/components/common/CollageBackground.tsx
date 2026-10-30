import React from 'react';
import schoolClassroom from '../../assets/images/school_classroom_students_1793261016320.jpg';

interface CollageBackgroundProps {
  className?: string;
  activeRoleHover?: 'admin' | 'school' | 'ngo' | null;
}

/** Full-screen government-school photograph used behind the landing page content. */
export const CollageBackground: React.FC<CollageBackgroundProps> = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-zinc-950 ${className}`}
  >
    <img
      src={schoolClassroom}
      alt=""
      className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.62] saturate-[0.8]"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_15%,_rgba(0,0,0,0.6)_100%)]" />
  </div>
);
