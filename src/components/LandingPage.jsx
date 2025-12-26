import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Zap,
  Shield,
  MapPin,
  Brain,
  Users,
  BarChart3,
} from "lucide-react";

const LandingPage = ({ onEnterApp, language }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  5 + Math.random() * 10
                }s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div
        className={`relative max-w-7xl mx-auto px-4 py-12 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Badge */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-purple-500/20 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 shadow-2xl">
            <Sparkles className="text-yellow-400 animate-pulse" size={20} />
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
              {language === "en"
                ? "🏆 2025 Seattle Civic Tech Hackathon"
                : "🏆 Hackathon Cívico de Seattle 2025"}
            </span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="inline-block bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
              CityPulse
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 text-transparent bg-clip-text animate-gradient-x">
              Connect
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light max-w-3xl mx-auto">
            {language === "en"
              ? "AI-Powered Transparency for Seattle City Services"
              : "Transparencia con IA para Servicios de la Ciudad de Seattle"}
          </p>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            {language === "en"
              ? "🚀 Transform how residents interact with city services using real-time data, predictive AI, and intelligent automation."
              : "🚀 Transforma cómo los residentes interactúan con los servicios de la ciudad usando datos en tiempo real, IA predictiva y automatización inteligente."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onEnterApp}
              className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl text-lg font-bold shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {language === "en" ? "Launch Platform" : "Iniciar Plataforma"}
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={24}
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={onEnterApp}
              className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-2xl text-lg font-semibold border-2 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              {language === "en" ? "📹 Watch Demo" : "📹 Ver Demo"}
            </button>
          </div>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            {
              number: "462+",
              label: language === "en" ? "Real Requests" : "Solicitudes Reales",
              color: "from-teal-400 to-cyan-400",
              icon: MapPin,
            },
            {
              number: "24/7",
              label: language === "en" ? "AI Assistant" : "Asistente IA",
              color: "from-purple-400 to-pink-400",
              icon: Brain,
            },
            {
              number: "2",
              label: language === "en" ? "Languages" : "Idiomas",
              color: "from-emerald-400 to-teal-400",
              icon: Globe,
            },
            {
              number: "5-7",
              label: language === "en" ? "Day Avg" : "Días Prom",
              color: "from-amber-400 to-orange-400",
              icon: TrendingUp,
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <Icon
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}
                    size={32}
                  />
                  <div
                    className={`text-4xl font-black bg-gradient-to-r ${stat.color} text-transparent bg-clip-text mb-2`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Zap,
              title:
                language === "en"
                  ? "AI-Powered Predictions"
                  : "Predicciones con IA",
              description:
                language === "en"
                  ? "Machine learning estimates resolution times based on request type, location, and department workload."
                  : "Aprendizaje automático estima tiempos de resolución basados en tipo, ubicación y carga de trabajo.",
              gradient: "from-teal-500 to-cyan-500",
            },
            {
              icon: BarChart3,
              title:
                language === "en"
                  ? "Real-Time Analytics"
                  : "Análisis en Tiempo Real",
              description:
                language === "en"
                  ? "Live dashboard with bottleneck detection, department performance, and automated insights for city staff."
                  : "Panel en vivo con detección de cuellos de botella, rendimiento de departamentos e información automatizada.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: Users,
              title:
                language === "en"
                  ? "Bilingual & Accessible"
                  : "Bilingüe y Accesible",
              description:
                language === "en"
                  ? "Full English and Spanish support with WCAG-compliant design for universal accessibility."
                  : "Soporte completo en inglés y español con diseño conforme a WCAG para accesibilidad universal.",
              gradient: "from-emerald-500 to-teal-500",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="relative bg-gradient-to-r from-teal-600 via-cyan-600 to-purple-600 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative">
            <div className="inline-block mb-6">
              <Shield className="text-white animate-bounce" size={64} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === "en"
                ? "🌲 Built with Seattle Open Data"
                : "🌲 Construido con Datos Abiertos de Seattle"}
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              {language === "en"
                ? "Integrated with data.seattle.gov for real-time customer service requests and tracking data. Powered by AI to serve Seattle better."
                : "Integrado con data.seattle.gov para solicitudes de servicio al cliente en tiempo real. Impulsado por IA para servir mejor a Seattle."}
            </p>
            <button
              onClick={onEnterApp}
              className="px-10 py-5 bg-white text-teal-600 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
            >
              {language === "en" ? "🚀 Get Started Now" : "🚀 Comenzar Ahora"}
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        {/* Tech Stack Badge */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            {language === "en" ? "Powered by" : "Desarrollado con"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "React",
              "Tailwind CSS",
              "AI/ML",
              "Seattle Open Data",
              "Recharts",
            ].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-sm text-gray-400 border border-white/10 hover:border-teal-500/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
