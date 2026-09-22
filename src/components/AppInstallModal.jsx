import React from 'react';
import { useStore } from '../context/StoreContext';
import { Download, Smartphone, Monitor, Apple, CheckCircle2, ExternalLink, X, Sparkles } from 'lucide-react';

export default function AppInstallModal({ isOpen, onClose }) {
  const { installPwaApp } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-modal border border-gold-500/40 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-500/40 bg-white p-0.5">
              <img src="/images/moj_logo.jpg" alt="MOJ Jewels" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h3 className="text-white font-serif font-bold text-lg">Install MOJ Jewels App</h3>
              <p className="text-[10px] text-gold-300">100% Free Application • No App Store Charges</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Primary Action Button */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-gold-500/30 text-center">
          <Sparkles className="w-6 h-6 text-gold-400 mx-auto animate-pulse" />
          <h4 className="text-white font-bold text-sm">Instant 1-Click Application Install</h4>
          <p className="text-xs text-slate-300">
            Enjoy full-screen shopping, fast order tracking, offline browsing, and instant WhatsApp ordering.
          </p>

          <button
            onClick={() => {
              installPwaApp();
              onClose();
            }}
            className="w-full btn-gold-shimmer py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xl"
          >
            <Download className="w-4 h-4 text-black animate-bounce" />
            <span>Click Here to Install MOJ App Now</span>
          </button>
        </div>

        {/* Browser Specific Guides */}
        <div className="space-y-3 text-xs">
          <span className="text-[11px] font-bold uppercase text-gold-400 tracking-wider block">
            Device Installation Methods:
          </span>

          {/* Android Chrome */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Smartphone className="w-4 h-4" />
              <span>Android Smartphone (Google Chrome)</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Tap the 3 dots menu in Chrome (top-right) $\rightarrow$ select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
            </p>
          </div>

          {/* iOS Safari */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Apple className="w-4 h-4" />
              <span>iPhone & iPad (Safari Browser)</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Tap the Safari <strong>Share button</strong> (square with up arrow) $\rightarrow$ scroll down & tap <strong>"Add to Home Screen"</strong>.
            </p>
          </div>

          {/* Windows / Mac Desktop */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-sky-400 font-bold">
              <Monitor className="w-4 h-4" />
              <span>Windows & Mac Computers</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Click the <strong>Install icon</strong> in Chrome/Edge URL address bar (top-right) to launch as a standalone desktop app.
            </p>
          </div>

          {/* Free APK Builder */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-purple-400 font-bold">
              <ExternalLink className="w-4 h-4" />
              <span>Standalone Android APK File (PWABuilder)</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              To generate a native `.apk` installer file for free, open <strong>PWABuilder.com</strong>, paste `https://moj-jewels.vercel.app/` and download your APK package!
            </p>
          </div>
        </div>

        {/* Footer Close */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800"
        >
          Close Installation Guide
        </button>
      </div>
    </div>
  );
}
