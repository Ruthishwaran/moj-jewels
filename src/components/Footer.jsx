import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Shield, Truck, Award, QrCode, Phone, Mail, MapPin, MessageCircle, Instagram, Youtube, Lock } from 'lucide-react';

export default function Footer() {
  const { setCurrentPage } = useStore();

  const whatsappNumber = "918248875865";
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
              WHOLESALE & RETAIL • Premium Imitation Jewellery • Bridal Sets • Antique & Temple Collections.
              <span className="block text-gold-300 font-serif font-semibold mt-1">"Timeless Beauty Made For You 🩷"</span>
            </p>

            {/* Social Icons Bar */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-gold-300 block mb-2">Follow Us For Exclusive Updates:</span>
              <div className="flex items-center space-x-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 flex items-center justify-center transition-colors shadow-md"
                  title="WhatsApp DM"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.396 0 0 5.397 0 12.035c0 2.116.553 4.184 1.603 6.004L0 24l6.136-1.609a11.95 11.95 0 005.895 1.558h.005c6.634 0 12.03-5.397 12.03-12.035A12.003 12.003 0 0012.031 0zm0 21.97h-.004a9.934 9.934 0 01-5.066-1.39l-.364-.216-3.765.987 1.004-3.67-.237-.377a9.96 9.96 0 01-1.529-5.271c0-5.498 4.473-9.972 9.976-9.972 2.664 0 5.168 1.038 7.049 2.922 1.882 1.883 2.918 4.388 2.918 7.054 0 5.5-4.474 9.973-9.976 9.973zm5.467-7.469c-.3-.15-1.772-.874-2.046-.973-.275-.1-.475-.15-.675.15-.2.3-.774.973-.95 1.172-.175.2-.35.225-.65.075-.3-.15-1.264-.466-2.408-1.485-.89-.793-1.49-1.773-1.665-2.073-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.243-.583-.49-.504-.675-.514-.175-.008-.375-.008-.575-.008-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.114 3.228 5.122 4.529.715.31 1.273.495 1.709.633.719.228 1.373.196 1.89.119.577-.086 1.772-.724 2.022-1.424.25-.7.25-1.3.175-1.424-.075-.125-.275-.2-.575-.35z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/moj.jewels?stkn=MWVnN216YWFmNzFwYQ=="
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/40 flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@moj.jewels?si=O-Xng2CYlOIrBSel"
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
                <span>+91 82488 75865</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>mojjewels2026@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Gudiyatham, Vellore - 635806</span>
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
            <span>Customer Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
