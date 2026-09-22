import React, { useState, Suspense } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackPage from './pages/OrderTrackPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import { ShieldCheck, LogOut } from 'lucide-react';

function MainContent() {
  const { currentPage, setCurrentPage, isAdminAuthenticated, logoutAdmin, isAppInstallable, installPwaApp } = useStore();
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'home': return <HomePage />;
        case 'shop': return <ShopPage />;
        case 'checkout': return <CheckoutPage />;
        case 'track': return <OrderTrackPage />;
        case 'customer-dashboard': return <CustomerDashboard />;
        case 'admin': return isAdminAuthenticated ? <AdminDashboard /> : <AdminLoginPage />;
        default: return <HomePage />;
      }
    } catch (e) {
      console.error('Page render error:', e);
      return <HomePage />;
    }
  };

  const isAdminView = currentPage === 'admin';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0b0f19] text-slate-100">
      {/* PWA Install Prompt Banner */}
      {!isAdminView && showPwaBanner && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-b border-gold-500/30 px-4 py-1.5 text-xs flex items-center justify-between text-slate-200">
          <div className="flex items-center space-x-2">
            <span className="text-gold-300 font-semibold">Install MOJ App for instant mobile ordering & deals</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={installPwaApp}
              className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-3 py-1 rounded-lg shadow-md transition-colors text-[11px]"
            >
              Install MOJ App 📲
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="text-slate-400 hover:text-white p-1"
              title="Close Banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {isAdminView && isAdminAuthenticated ? (
        <div className="bg-amber-500 text-black px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <span>MOJ JEWELS - PROTECTED STORE ADMIN DESK</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentPage('home')} className="hover:underline font-semibold">
              Exit to Customer Storefront ➔
            </button>
            <button
              onClick={logoutAdmin}
              className="bg-black text-amber-400 px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout Admin
            </button>
          </div>
        </div>
      ) : (
        <Navbar />
      )}

      <main className="flex-1">
        {renderPage()}
      </main>

      {!isAdminView && <Footer />}
      {!isAdminView && <FloatingWhatsApp />}

      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught app error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl space-y-4">
            <h2 className="text-xl font-serif font-bold text-amber-400">MOJ Jewels Store Error</h2>
            <p className="text-xs text-slate-300">
              {this.state.error?.message || "An unexpected issue occurred while rendering the page."}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-amber-500 text-black font-bold px-4 py-2 rounded-xl text-xs"
              >
                Reload App
              </button>
              <button
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs hover:bg-slate-700"
              >
                Reset Store Cache
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MainContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
