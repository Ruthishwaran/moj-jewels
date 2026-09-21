import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Shield, Truck, Award, QrCode, Phone, Mail, MapPin, MessageCircle, Instagram, Youtube, Lock } from 'lucide-react';

export default function Footer() {
  const { setCurrentPage } = useStore();

  const whatsappNumber = "919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi MOJ Jewels!')}`;

  return (
    <footer className="bg-[#05070d] text-slate-400 border-t border-gold-500/20 pt-16 pb-12">
      <div className="container mx-auto px-4">
        {/* Brand Info & Social Platform Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo & Bio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-500/40 bg-white p-0.5">
                <img src="/images/moj_logo.jpg" alt="MOJ Jewels" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-widest">
                MOJ <span className="text-gold-400">JEWELS</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              WHOLESALE & RETAIL • Premium Imitation Jewellery • Bridal Sets • Antique & Temple Collections. Timeless beauty made for you.
            </p>

            {/* Social Icons Bar */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-gold-300 block mb-2">Follow Us For Exclusive Updates:</span>
              <div className="flex items-center space-x-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/moj_jewels"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/40 flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@moj_jewels"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/40 flex items-center justify-center transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 border-b border-gold-500/30 pb-2 inline-block">
              Quick Customer Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-gold-400 transition-colors">
                  Home & Banners Showcase
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-gold-400 transition-colors">
                  Browse All Wholesale & Retail Items
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('track')} className="hover:text-gold-400 transition-colors">
                  Track Your Order Online
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('customer-dashboard')} className="hover:text-gold-400 transition-colors">
                  Customer Profile & Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 border-b border-gold-500/30 pb-2 inline-block">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold-400">Bridal & Antique Sets</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold-400">Temple Jewellery</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold-400">Solitaire & Floral Rings</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold-400">Peacock Jhumka Earrings</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold-400">Matte Gold Bangles</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-serif font-semibold text-base border-b border-gold-500/30 pb-2 inline-block">
              Customer Support
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>care@mojjewels.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Commercial Street, Bangalore - 560001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Discreet Admin Portal Link */}
        <div className="pt-8 border-t border-slate-800 text-xs text-center md:flex md:justify-between md:items-center">
          <p>© {new Date().getFullYear()} MOJ Jewels. All rights reserved. Wholesale & Retail.</p>
          <div className="mt-4 md:mt-0 flex justify-center items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            {/* Discreet link for Store Admin */}
            <button
              onClick={() => setCurrentPage('admin')}
              className="text-slate-600 hover:text-gold-400 flex items-center gap-1 text-[11px]"
              title="Store Staff Login"
            >
              <Lock className="w-3 h-3" /> Store Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
