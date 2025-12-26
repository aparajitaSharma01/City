import React, { useState } from "react";
import {
  MapPin,
  Globe,
  Users,
  BarChart3,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

const Header = ({ view, setView, language, setLanguage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 shadow-2xl border-b-2 border-teal-500/30">
      {/* Animated top accent line */}
      <div className="h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 animate-gradient-x"></div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Section - Enhanced */}
          <div className="flex items-center gap-4">
            {/* Animated Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-2xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <MapPin className="text-white" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black">
                  <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                    CityPulse
                  </span>
                  <span className="text-white"> Connect</span>
                </h1>
                <Sparkles
                  className="text-yellow-400 animate-pulse hidden md:block"
                  size={20}
                />
              </div>
              <p className="text-xs md:text-sm text-teal-300 font-semibold flex items-center gap-2">
                <span className="hidden md:inline">🌲</span>
                {language === "en"
                  ? "Seattle • AI-Powered Transparency"
                  : "Seattle • Transparencia con IA"}
                <span className="hidden md:inline">🌧️</span>
              </p>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle - Enhanced */}
            <div className="relative group">
              <button
                onClick={() => setLanguage(language === "en" ? "es" : "en")}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-teal-500/50 border border-white/20 hover:border-teal-400/50 group-hover:scale-105"
              >
                <Globe
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="text-sm font-bold">
                  {language === "en" ? "🇺🇸 EN" : "🇪🇸 ES"}
                </span>
              </button>
            </div>

            {/* View Toggle - Enhanced */}
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1.5 border border-white/20 shadow-lg">
              <button
                onClick={() => setView("resident")}
                className={`group px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  view === "resident"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Users
                  size={18}
                  className={
                    view === "resident"
                      ? "animate-bounce"
                      : "group-hover:scale-110 transition-transform"
                  }
                />
                <span className="hidden lg:inline">
                  {language === "en" ? "Resident" : "Residente"}
                </span>
              </button>
              <button
                onClick={() => setView("staff")}
                className={`group px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  view === "staff"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <BarChart3
                  size={18}
                  className={
                    view === "staff"
                      ? "animate-bounce"
                      : "group-hover:scale-110 transition-transform"
                  }
                />
                <span className="hidden lg:inline">
                  {language === "en" ? "Staff" : "Personal"}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 animate-in slide-in-from-top duration-300">
            <div className="space-y-3">
              {/* View Selection */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setView("resident");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    view === "resident"
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  <Users size={18} />
                  {language === "en" ? "Resident" : "Residente"}
                </button>
                <button
                  onClick={() => {
                    setView("staff");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    view === "staff"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  <BarChart3 size={18} />
                  {language === "en" ? "Staff" : "Personal"}
                </button>
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => {
                  setLanguage(language === "en" ? "es" : "en");
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-white/10 rounded-lg text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
              >
                <Globe size={18} />
                {language === "en" ? "🇺🇸 English" : "🇪🇸 Español"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent line - subtle animation */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50"></div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
