import React, { useState } from 'react';
import { Shield, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
  isLoading: boolean;
}

export function AuthPage({ onLogin, isLoading }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#030712] text-gray-100 font-['Outfit',sans-serif] overflow-hidden relative">
      {/* Background gradients/glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      {/* Left side: Premium Fintech Branding & Features (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 p-12 lg:p-20 flex-col justify-between border-r border-gray-800/40 relative z-10">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-lg">AS</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Arthik<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Setu</span>
            </span>
          </div>

          <div className="space-y-8 max-w-lg mt-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Aapki Kamai, Aapka <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Future, Secured.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              India's first AI-powered financial advisor designed exclusively for Swiggy, Zomato, Uber, Ola, and other gig economy partners.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16 max-w-xl">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Unified Tracker</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Track Swiggy, Zomato, and Uber payouts in a single beautiful dashboard.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">AI Assistant</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Ask questions in Hinglish about saving taxes and finding government schemes.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Zero-Storage Privacy</h3>
              <p className="text-xs text-gray-400 leading-relaxed">We strictly comply with the DPDP Act 2023. We never store your full ID documents.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Tax & Loan Planner</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Estimate annual income tax automatically and explore micro-loan options.</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          &copy; 2026 ArthikSetu. Government scheme recommendations are for information only.
        </div>
      </div>

      {/* Right side: Modern Glassmorphic Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        {/* Logo for mobile view */}
        <div className="flex md:hidden items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-lg">AS</span>
          </div>
          <span className="text-2xl font-black text-white">ArthikSetu</span>
        </div>

        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          {/* Subtle inside glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

          {/* Login / Signup Tabs */}
          <div className="flex p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] mb-8 relative z-20">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-sm text-gray-400">
              {activeTab === 'login'
                ? 'Sign in to access your dashboard, AI assistant, and reports.'
                : 'Create your free account to track payouts, save taxes, and claim schemes.'}
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={onLogin}
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-300 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>
                    {activeTab === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our <a href="#terms" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#privacy" className="text-blue-400 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
