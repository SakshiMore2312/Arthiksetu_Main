import { Building2, FileText, Gift, BarChart3, User, Bot, Landmark, MessageSquare, FileSearch, ShieldCheck, TrendingUp, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentPage: 'dashboard' | 'unified-dashboard' | 'sms-analyzer' | 'tax' | 'schemes' | 'loans' | 'reports' | 'profile' | 'ai-assistant' | 'document-verify' | 'privacy-dashboard';
  onNavigate: (page: 'dashboard' | 'unified-dashboard' | 'sms-analyzer' | 'tax' | 'schemes' | 'loans' | 'reports' | 'profile' | 'ai-assistant' | 'document-verify' | 'privacy-dashboard') => void;
  user?: any;
}

export function Navigation({ currentPage, onNavigate, user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'unified-dashboard' as const, label: 'Unified Dashboard' },
    { id: 'sms-analyzer' as const, label: 'SMS Analyzer' },
    { id: 'ai-assistant' as const, label: 'AI Assistant' },
    { id: 'document-verify' as const, label: 'Verify Docs' },
    { id: 'tax' as const, label: 'Tax & ITR' },
    { id: 'schemes' as const, label: 'Schemes' },
    { id: 'loans' as const, label: 'Loans' },
    { id: 'reports' as const, label: 'Reports' },
    { id: 'privacy-dashboard' as const, label: 'Privacy' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: '#1e3a5f' }}>
                <span className="text-white font-bold text-lg">AS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#1e3a5f] to-blue-600 bg-clip-text text-transparent">ArthikSetu</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('profile')}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 hover:border-gray-300 transition-all"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="profile" className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-gray-500" />
              )}
              <span>{user?.displayName ? user.displayName.split(' ')[0] : 'Profile'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="space-y-2 mt-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                onNavigate('profile');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium"
            >
              {user?.photoURL && (
                <img src={user.photoURL} alt="profile" className="w-5 h-5 rounded-full" />
              )}
              <span>{user?.displayName || 'Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}