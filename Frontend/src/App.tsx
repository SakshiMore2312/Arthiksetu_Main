import { useState, useEffect } from 'react';

import { EarningsProvider } from './EarningsContext';

import { Navigation } from './components/Navigation';
import { DashboardPage } from './components/DashboardPage';
import { TaxPage } from './components/TaxPage';
import { SchemesPage } from './components/SchemesPage';
import { ReportsPage } from './components/ReportsPage';
import { ProfilePage } from './components/ProfilePage';
import { AIAssistantPage } from './components/AIAssistantPage';
import { Loans } from './components/Loans';
import { UnifiedDashboard } from './components/UnifiedDashboard';
import { SMSAnalyzer } from './components/SMSAnalyzer';
import { MessageDecoder } from './components/MessageDecoder';
import { DocumentVerification } from './components/DocumentVerification';
import { PrivacyDashboard } from './components/PrivacyDashboard';
import { AuthPage } from './components/AuthPage';
import { API_BASE_URL } from './config';

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "./firebase";

type PageType =
  | 'dashboard'
  | 'unified-dashboard'
  | 'sms-analyzer'
  | 'tax'
  | 'schemes'
  | 'loans'
  | 'reports'
  | 'profile'
  | 'ai-assistant'
  | 'message-decoder'
  | 'document-verify'
  | 'privacy-dashboard'
  | 'about'
  | 'how-it-works'
  | 'privacy'
  | 'terms'
  | 'help'
  | 'contact'
  | 'faq';

const StaticPage = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-[#0A1F44] mb-6">
      {title}
    </h1>

    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-gray-600 leading-relaxed">
      {content}
    </div>
  </div>
);

export default function App() {

  const [currentPage, setCurrentPage] =
    useState<PageType>('dashboard');

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is disabled or not configured.");
      setAuthLoading(false);
      return;
    }

    const unsubscribe =
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          console.log("Logged in successfully");
          setUser(currentUser);
          if (currentUser.email) {
            localStorage.setItem("user_email", currentUser.email);
          }
        } else {
          console.log("No user");
          setUser(null);
          localStorage.removeItem("user_email");
        }
        setAuthLoading(false);
      });

    return () => unsubscribe();

  }, []);

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) {
      alert("Firebase Authentication is not available. Please verify your Firebase settings.");
      return;
    }

    try {
      setLoginLoading(true);
      await signInWithPopup(
        auth,
        googleProvider
      );
      console.log(
        "Login Success"
      );
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;

    try {
      // Clear client side permissions and other stored state
      localStorage.clear();

      await signOut(auth);
      console.log("Logged out");
      setCurrentPage('dashboard');
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    }
  };

  const renderPage = () => {

    switch (currentPage) {

      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(page: any) =>
              setCurrentPage(page)
            }
          />
        );

      case 'unified-dashboard':
        return <UnifiedDashboard />;

      case 'sms-analyzer':
        return <SMSAnalyzer />;

      case 'message-decoder':
        return <MessageDecoder />;

      case 'document-verify':
        return <DocumentVerification />;

      case 'privacy-dashboard':
        return <PrivacyDashboard />;

      case 'tax':
        return <TaxPage />;

      case 'schemes':
        return <SchemesPage />;

      case 'loans':
        return <Loans />;

      case 'reports':
        return <ReportsPage />;

      case 'profile':
        return <ProfilePage user={user} onLogout={handleLogout} />;

      case 'ai-assistant':
        return <AIAssistantPage />;

      case 'about':
        return (
          <StaticPage
            title="About Us"
            content="ArthikSetu is a pioneering platform dedicated to empowering India's gig economy workers."
          />
        );

      case 'how-it-works':
        return (
          <StaticPage
            title="How It Works"
            content={
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Connect Accounts:</strong>
                  Securely link your gig platform accounts.
                </li>

                <li>
                  <strong>Track Earnings:</strong>
                  View all your income in one dashboard.
                </li>

                <li>
                  <strong>Get Recommendations:</strong>
                  AI suggests relevant government schemes.
                </li>

                <li>
                  <strong>Manage Taxes:</strong>
                  Generate audit-safe reports.
                </li>
              </ul>
            }
          />
        );

      case 'privacy':
        return (
          <StaticPage
            title="Privacy Policy"
            content="Your privacy is our highest priority."
          />
        );

      case 'terms':
        return (
          <StaticPage
            title="Terms of Service"
            content="By using ArthikSetu, you agree to our terms."
          />
        );

      case 'help':
        return (
          <StaticPage
            title="Help Center"
            content="Need assistance? Our support team is available."
          />
        );

      case 'contact':
        return (
          <StaticPage
            title="Contact Us"
            content={
              <div>
                <p className="mb-4">
                  We'd love to hear from you.
                </p>

                <p>
                  <strong>Email:</strong>
                  support@arthiksetu.in
                </p>

                <p>
                  <strong>Phone:</strong>
                  xxxx-xxx-xxx
                </p>
              </div>
            }
          />
        );

      case 'faq':
        return (
          <StaticPage
            title="Frequently Asked Questions"
            content={
              <div className="space-y-4">

                <div>
                  <p className="font-semibold text-[#0A1F44]">
                    Is ArthikSetu free?
                  </p>

                  <p>
                    Yes, core features are free.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#0A1F44]">
                    Is my data safe?
                  </p>

                  <p>
                    Yes. We use secure encryption.
                  </p>
                </div>

              </div>
            }
          />
        );

      default:
        return <DashboardPage />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium font-['Outfit']">Initializing session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleGoogleLogin} isLoading={loginLoading} />;
  }

  return (

    <EarningsProvider>

      <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">

        <Navigation
          currentPage={
            currentPage === 'dashboard' ||
            currentPage === 'unified-dashboard' ||
            currentPage === 'sms-analyzer' ||
            currentPage === 'tax' ||
            currentPage === 'schemes' ||
            currentPage === 'loans' ||
            currentPage === 'reports' ||
            currentPage === 'profile' ||
            currentPage === 'ai-assistant' ||
            currentPage === 'document-verify' ||
            currentPage === 'privacy-dashboard'
              ? currentPage
              : 'dashboard'
          }

          onNavigate={(page: any) =>
            setCurrentPage(page)
          }
          user={user}
        />

        <main>
          {renderPage()}
        </main>

        {/* Footer */}

        <footer className="bg-gradient-to-br from-gray-900 via-[#0A1F44] to-[#1e3a5f] border-t border-gray-800 mt-20">

          <div className="max-w-7xl mx-auto px-4 py-16">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

              <div className="col-span-1 md:col-span-2">

                <div className="flex items-center space-x-3 mb-6">

                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-black text-xl">
                      AS
                    </span>
                  </div>

                  <span className="text-2xl font-black text-white">
                    ArthikSetu
                  </span>

                </div>

                <p className="text-gray-300 text-sm max-w-md leading-relaxed mb-6">
                  Empowering India's gig workers with AI-powered financial tools.
                </p>

              </div>

            </div>

            <div className="pt-8 border-t border-gray-700">

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <p className="text-gray-400 text-sm">
                  © 2026 ArthikSetu. All rights reserved.
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400">

                  <span className="px-3 py-1.5 bg-white/5 rounded-lg">
                    v1.0.0
                  </span>

                  <span>•</span>

                  <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg font-semibold">
                    ● Online
                  </span>

                </div>

              </div>

            </div>

          </div>

        </footer>

      </div>

    </EarningsProvider>
  );
}