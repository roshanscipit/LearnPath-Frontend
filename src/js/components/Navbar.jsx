import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, LogOut, MessageSquare, LayoutDashboard, UserCircle, ChevronDown } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/roles', label: 'Learning Paths' },
    { to: '/companies', label: 'Companies' },
    { to: '/mock-tests', label: 'Mock Tests' },
    { to: '/career-agent', label: 'AI Career Agent' },
    { to: '/paid-services', label: 'Premium' },
  ];

  return (
    <nav className="bg-black text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/doliuw-logo.png" alt="Doliuw" className="h-12 w-auto object-contain drop-shadow-md" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="text-sm font-medium hover:text-gray-300 transition-colors">
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-white hover:text-black transition-colors">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" />Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700">
                      {user.avatar
                        ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-600" />
                        : <UserCircle className="w-7 h-7 text-gray-300" />}
                      <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-white w-44">
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/profile" className="flex items-center">
                        <UserCircle className="w-4 h-4 mr-2 text-gray-400" />My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
                      <Link to="/help" className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />Help & Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-red-400 focus:text-red-400">
                      <LogOut className="w-4 h-4 mr-2" />Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-gray-300 hover:text-white hover:bg-gray-800">
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')} className="bg-white text-black hover:bg-gray-200 font-medium">
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="block px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}>
                {label}
              </Link>
            ))}

            <div className="border-t border-gray-800 pt-3 mt-3 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      : <UserCircle className="w-8 h-8 text-gray-300" />}
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email || user.mobile}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="block px-3 py-2.5 rounded-lg hover:bg-gray-800 text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 inline mr-2" />Dashboard
                  </Link>
                  <Link to="/profile" className="block px-3 py-2.5 rounded-lg hover:bg-gray-800 text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <UserCircle className="w-4 h-4 inline mr-2" />My Profile
                  </Link>
                  <Link to="/help" className="block px-3 py-2.5 rounded-lg hover:bg-gray-800 text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <MessageSquare className="w-4 h-4 inline mr-2" />Help & Support
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-800 text-sm font-medium text-red-400 transition-colors">
                    <LogOut className="w-4 h-4 inline mr-2" />Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-1">
                  <Button className="flex-1 bg-white text-black hover:bg-gray-200 text-sm" onClick={() => { navigate('/login'); setIsOpen(false); }}>Sign In</Button>
                  <Button className="flex-1 bg-gray-800 text-white hover:bg-gray-700 text-sm" onClick={() => { navigate('/signup'); setIsOpen(false); }}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
