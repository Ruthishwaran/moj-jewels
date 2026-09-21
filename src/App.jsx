import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ErrorBoundary } from './components/ErrorBoundary';
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
  const { currentPage, setCurrentPage, isAdminAuthenticated, logoutAdmin } = useStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'track':
        return <OrderTrackPage />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'admin':
        return isAdminAuthenticated ? <AdminDashboard /> : <AdminLoginPage />;
      default:
        return <HomePage />;
    }
  };

  const isAdminView = currentPage === 'admin';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0b0f19] text-slate-100">
      {/* If logged into Admin view, show Admin top bar */}
      {isAdminView && isAdminAuthenticated ? (
        <div className="bg-amber-500 text-black px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <span>MOJ JEWELS - PROTECTED STORE ADMIN DESK</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="hover:underline font-semibold text-black"
            >
              Exit to Customer Storefront ➔
            </button>
            <button
              onClick={logoutAdmin}
              className="bg-black text-amber-400 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-slate-900"
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

      {/* Global Customer Overlays */}
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
    </div>
  );
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
