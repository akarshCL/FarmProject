import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Settings, Search, User, Home, MapPin, Box, Users, Video, ShoppingBag, MessageSquare, Wallet } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AgricultureNews from '../news/AgricultureNews';
import GrowthGuide from '../ai/GrowthGuide';
import WeatherWidget from './widgets/WeatherWidget';
import FinanceWidget from '../finance/FinanceWidget';
import NotificationCenter from './widgets/NotificationCenter';
import CalendarWidget from './widgets/CalendarWidget';
import PlotSummary from './PlotSummary';

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  
  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Plots', icon: MapPin, path: '/plots' },
    { name: 'Inventory', icon: Box, path: '/inventory' },
    { name: 'Workforce', icon: Users, path: '/workforce' },
    { name: 'CCTV', icon: Video, path: '/cctv' },
    { name: 'Vendors', icon: ShoppingBag, path: '/vendors' },
    { name: 'WhatsApp', icon: MessageSquare, path: '/whatsapp' },
    { name: 'Finance', icon: Wallet, path: '/finance' }
  ];

  const handleNavigation = (path: string, name: string) => {
    setActiveModule(name.toLowerCase());
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-farm-primary-800">
        <div className="p-4 border-b border-farm-primary-700">
          <h1 className="text-2xl font-bold text-white">Farm Manager</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map(({ name, icon: Icon, path }) => (
              <li key={name.toLowerCase()}>
                <button
                  onClick={() => handleNavigation(path, name)}
                  className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors duration-200 ${
                    activeModule === name.toLowerCase()
                      ? 'bg-farm-primary-700 text-white'
                      : 'text-farm-primary-100 hover:bg-farm-primary-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <CalendarWidget />
            <button 
              onClick={() => handleNavigation('/settings', 'settings')}
              className="text-gray-500 hover:text-gray-700"
            >
              <Settings className="h-6 w-6" />
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
            >
              <div className="h-8 w-8 bg-farm-primary-700 rounded-full flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Farm Dashboard</h2>
            <p className="text-gray-600">Welcome back! Here's what's happening on your farm today</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Weather Widget */}
            <div className="col-span-12 lg:col-span-4">
              <WeatherWidget />
            </div>

            {/* Finance Overview */}
            <div className="col-span-12 lg:col-span-4">
              <FinanceWidget />
            </div>

            {/* Growth Guide */}
            <div className="col-span-12 lg:col-span-6">
              <GrowthGuide />
            </div>

            {/* Agriculture News */}
            <div className="col-span-12 lg:col-span-6">
              <AgricultureNews />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}