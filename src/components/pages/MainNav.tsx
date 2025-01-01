import React, { useState } from 'react';
import { Settings, Bell, CloudSun, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type NavItem = 'Analytics' | 'Current Weather' | 'Forecast';

const MainNav = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('Analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-blue-100/30 backdrop-blur-md border-b border-white/20 z-30 shadow-sm">
      <nav className="h-16 max-w-[1600px] mx-auto flex items-center justify-between px-4 lg:px-6">
        
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="flex items-center gap-2 hover:opacity-90 cursor-pointer transition-transform duration-200 hover:scale-105">
              <CloudSun className="h-8 w-8 text-blue-600" />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-transparent bg-clip-text">
                WeatherApp
              </span>
            </div>
          </Link>
        </div>

      
        <div className="hidden md:flex gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-lg">
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

      
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <IconButton>
              <Settings className="h-5 w-5" />
            </IconButton>
            <IconButton hasNotification>
              <Bell className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden ring-2 ring-white/50 transition-all duration-300 hover:ring-blue-500 hover:scale-105 cursor-pointer">
            <Image 
              src="/avatar.jpg"
              alt="Profile"
              fill
              sizes="(max-width: 640px) 32px, 36px"
              className="object-cover"
              priority
            />
          </div>
          <button
            onClick={toggleMobileMenu}
            className="ml-2 p-2 md:hidden rounded-lg hover:bg-white/20"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </nav>

    
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/70 backdrop-blur-md border-b border-white/20">
          <div className="px-4 py-3 space-y-2">
            <MobileNavButton 
              label="Analytics" 
              isActive={activeTab === 'Analytics'}
              onClick={() => {
                setActiveTab('Analytics');
                setIsMobileMenuOpen(false);
              }}
            />
            <MobileNavButton 
              label="Current Weather" 
              isActive={activeTab === 'Current Weather'}
              onClick={() => {
                setActiveTab('Current Weather');
                setIsMobileMenuOpen(false);
              }}
            />
            <MobileNavButton 
              label="Forecast" 
              isActive={activeTab === 'Forecast'}
              onClick={() => {
                setActiveTab('Forecast');
                setIsMobileMenuOpen(false);
              }}
            />
            <div className="pt-2 border-t border-gray-100/50">
              <MobileNavButton
                label="Settings"
                icon={<Settings className="h-5 w-5" />}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileNavButton
                label="Notifications"
                icon={<Bell className="h-5 w-5" />}
                hasNotification
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void; }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
      transform hover:scale-105
      ${isActive 
        ? 'bg-white text-blue-700 shadow-md' 
        : 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
      }
    `}
  >
    {label}
  </button>
);

const MobileNavButton = ({ 
  label, 
  isActive,
  icon,
  hasNotification,
  onClick 
}: { 
  label: string; 
  isActive?: boolean;
  icon?: React.ReactNode;
  hasNotification?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      w-full px-4 py-3 rounded-lg text-left flex items-center gap-3
      transition-all duration-300
      ${isActive 
        ? 'bg-blue-100/80 text-blue-700' 
        : 'text-gray-600 hover:bg-white/80'
      }
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
    {hasNotification && (
      <span className="ml-auto h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
    )}
  </button>
);

const IconButton = ({ children, hasNotification = false }: { children: React.ReactNode; hasNotification?: boolean }) => (
  <button className="p-2 rounded-full text-gray-600 hover:bg-white/20 hover:text-blue-700 transition-all duration-300 relative transform hover:scale-110">
    {children}
    {hasNotification && (
      <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
    )}
  </button>
);

export default MainNav;