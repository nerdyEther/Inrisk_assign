// src/components/pages/MainNav.tsx
'use client';

import React, { useState } from 'react';
import { Settings, Bell, CloudSun } from 'lucide-react';

// Define navigation items type
type NavItem = 'Analytics' | 'Current Weather' | 'Forecast';

const MainNav = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('Analytics');

  return (
    <div className="w-full bg-white border-b">
      <nav className="h-16 max-w-[1600px] mx-auto flex items-center justify-between px-6">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 hover:opacity-90 cursor-pointer transition-transform duration-200 hover:scale-105">
            <CloudSun className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-transparent bg-clip-text">
              WeatherScope
            </span>
          </div>
        </div>

        {/* Middle - Navigation */}
        <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
          <NavButton 
            label="Analytics" 
            isActive={activeTab === 'Analytics'}
            onClick={() => setActiveTab('Analytics')}
          />
          <NavButton 
            label="Current Weather" 
            isActive={activeTab === 'Current Weather'}
            onClick={() => setActiveTab('Current Weather')}
          />
          <NavButton 
            label="Forecast" 
            isActive={activeTab === 'Forecast'}
            onClick={() => setActiveTab('Forecast')}
          />
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-2">
          <IconButton>
            <Settings className="h-5 w-5" />
          </IconButton>
          <IconButton hasNotification>
            <Bell className="h-5 w-5" />
          </IconButton>
          <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-gray-100 transition-all duration-300 hover:ring-blue-400 hover:scale-105 cursor-pointer">
            <img 
              src="/avatar.jpg"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

// Updated NavButton with onClick handler
const NavButton = ({ 
  label, 
  isActive,
  onClick 
}: { 
  label: string; 
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
      transform hover:scale-105
      ${isActive 
        ? 'bg-white text-blue-600 shadow-md' 
        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
      }
    `}
  >
    {label}
  </button>
);

const IconButton = ({ 
  children, 
  hasNotification = false 
}: { 
  children: React.ReactNode; 
  hasNotification?: boolean 
}) => (
  <button className="p-2 rounded-full text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-300 relative transform hover:scale-110">
    {children}
    {hasNotification && (
      <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
    )}
  </button>
);

export default MainNav;