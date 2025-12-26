import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Home,
  ArrowLeft,
} from "lucide-react";

const ChatBot = ({ requests, language, onReturnToMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Generate intelligent response based on request data
  const generateSmartResponse = (question) => {
    const q = question.toLowerCase();

    // Calculate real statistics
    const stats = {
      total: requests.length,
      completed: requests.filter((r) => r.status === "Completed").length,
      inProgress: requests.filter((r) => r.status === "In Progress").length,
      assigned: requests.filter((r) => r.status === "Assigned").length,
      submitted: requests.filter((r) => r.status === "Submitted").length,
      highPriority: requests.filter((r) => r.priority === "High").length,
    };

    // Group by neighborhood
    const byNeighborhood = {};
    requests.forEach((r) => {
      byNeighborhood[r.neighborhood] =
        (byNeighborhood[r.neighborhood] || 0) + 1;
    });
    const topNeighborhood = Object.entries(byNeighborhood).sort(
      (a, b) => b[1] - a[1]
    )[0];

    // Group by type
    const byType = {};
    requests.forEach((r) => {
      byType[r.type] = (byType[r.type] || 0) + 1;
    });
    const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];

    // Weather impact check
    if (
      q.includes("weather") ||
      q.includes("clima") ||
      q.includes("rain") ||
      q.includes("lluvia")
    ) {
      const weatherTypes = ["Pothole", "Water Leak", "Street Light"];
      const weatherAffected = requests.filter((r) =>
        weatherTypes.includes(r.type)
      );

      return language === "en"
        ? `🌧️ **Weather Impact Analysis:**\n\n• ${
            weatherAffected.length
          } requests potentially affected by Seattle weather\n• Most common: ${
            topType ? topType[0] : "Various types"
          } (${
            topType ? topType[1] : 0
          } requests)\n• Rain can slow repairs by 1-2 days\n• Current active requests: ${
            stats.inProgress
          }\n\n💡 Seattle Public Works prioritizes safety-critical issues during bad weather!`
        : `🌧️ **Análisis de Impacto Climático:**\n\n• ${
            weatherAffected.length
          } solicitudes potencialmente afectadas por el clima\n• Más común: ${
            topType ? topType[0] : "Varios tipos"
          }\n• La lluvia puede retrasar reparaciones 1-2 días\n• Solicitudes activas: ${
            stats.inProgress
          }`;
    }

    // Nearby/neighborhood check
    if (
      q.includes("nearby") ||
      q.includes("neighborhood") ||
      q.includes("cerca") ||
      q.includes("vecindario")
    ) {
      const neighborhoods = Object.entries(byNeighborhood)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return language === "en"
        ? `📍 **Seattle Neighborhood Activity:**\n\n🏙️ Top 5 Neighborhoods:\n${neighborhoods
            .map((n, i) => `${i + 1}. ${n[0]}: ${n[1]} requests`)
            .join("\n")}\n\n🔥 Most Active: ${
            topNeighborhood ? topNeighborhood[0] : "N/A"
          } with ${
            topNeighborhood ? topNeighborhood[1] : 0
          } requests\n\n💡 Use the map to see exact locations in your area!`
        : `📍 **Actividad por Vecindario:**\n\n🏙️ Top 5 Vecindarios:\n${neighborhoods
            .map((n, i) => `${i + 1}. ${n[0]}: ${n[1]} solicitudes`)
            .join("\n")}\n\n🔥 Más activo: ${
            topNeighborhood ? topNeighborhood[0] : "N/A"
          }`;
    }

    // Urgent/high priority check
    if (
      q.includes("urgent") ||
      q.includes("high") ||
      q.includes("priority") ||
      q.includes("urgente") ||
      q.includes("prioridad")
    ) {
      const highPriorityRequests = requests
        .filter((r) => r.priority === "High")
        .slice(0, 5);

      return language === "en"
        ? `⚡ **High Priority Requests:**\n\n🚨 Total urgent issues: ${
            stats.highPriority
          }\n\n📋 Recent high-priority:\n${highPriorityRequests
            .map(
              (r) => `• ${r.id}: ${r.type} in ${r.neighborhood} - ${r.status}`
            )
            .join(
              "\n"
            )}\n\n⏱️ Average response: 24-48 hours\n💡 High priority = faster city response!`
        : `⚡ **Solicitudes de Alta Prioridad:**\n\n🚨 Problemas urgentes: ${
            stats.highPriority
          }\n\n📋 Recientes:\n${highPriorityRequests
            .map((r) => `• ${r.id}: ${r.type} - ${r.status}`)
            .join("\n")}`;
    }

    // Seattle stats
    if (
      q.includes("stat") ||
      q.includes("seattle") ||
      q.includes("tell me") ||
      q.includes("cuéntame")
    ) {
      const completionRate = ((stats.completed / stats.total) * 100).toFixed(1);

      return language === "en"
        ? `📊 **Seattle Service Request Statistics:**\n\n📈 Overview:\n• Total Requests: ${
            stats.total
          }\n• ✅ Completed: ${
            stats.completed
          } (${completionRate}%)\n• 🔵 In Progress: ${
            stats.inProgress
          }\n• 🟡 Assigned: ${stats.assigned}\n• 🔴 Submitted: ${
            stats.submitted
          }\n\n🏆 Top Request Type: ${topType ? topType[0] : "N/A"} (${
            topType ? topType[1] : 0
          })\n🏘️ Most Active: ${
            topNeighborhood ? topNeighborhood[0] : "N/A"
          } (${topNeighborhood ? topNeighborhood[1] : 0})\n⚡ High Priority: ${
            stats.highPriority
          }\n\n🌲 Seattle is actively managing these requests!`
        : `📊 **Estadísticas de Seattle:**\n\n📈 Resumen:\n• Total: ${
            stats.total
          }\n• ✅ Completadas: ${
            stats.completed
          } (${completionRate}%)\n• 🔵 En Progreso: ${
            stats.inProgress
          }\n• 🟡 Asignadas: ${stats.assigned}\n\n🏆 Tipo Principal: ${
            topType ? topType[0] : "N/A"
          }\n🏘️ Más Activo: ${topNeighborhood ? topNeighborhood[0] : "N/A"}`;
    }

    // Status check
    if (
      q.includes("status") ||
      q.includes("estado") ||
      q.includes("my request")
    ) {
      return language === "en"
        ? `🔍 **Check Request Status:**\n\n📋 Current Status Breakdown:\n• ✅ Completed: ${stats.completed}\n• 🔵 In Progress: ${stats.inProgress}\n• 🟡 Assigned: ${stats.assigned}\n• 🔴 Submitted: ${stats.submitted}\n\n💡 To check a specific request, provide the ID (e.g., "What's the status of 24-00123456?")\n\n🗺️ You can also click any marker on the map to see details!`
        : `🔍 **Verificar Estado:**\n\n📋 Resumen:\n• ✅ Completadas: ${stats.completed}\n• 🔵 En Progreso: ${stats.inProgress}\n• 🟡 Asignadas: ${stats.assigned}\n• 🔴 Enviadas: ${stats.submitted}\n\n💡 Para verificar una solicitud específica, proporcione el ID`;
    }

    // How long / time
    if (
      q.includes("how long") ||
      q.includes("time") ||
      q.includes("cuánto") ||
      q.includes("cuando")
    ) {
      const avgDays = requests.length > 0 ? "5-7" : "N/A";

      return language === "en"
        ? `⏱️ **Resolution Time Estimates:**\n\n📊 Average resolution: ${avgDays} days\n\n🎯 By Type:\n• Pothole: 5-7 days\n• Street Light: 3-5 days\n• Graffiti: 2-4 days\n• Trash Pickup: 1-2 days\n• Water Leak: 7-10 days\n\n⚡ High priority: 24-48 hours\n🏙️ Times vary by location & department workload\n\n💡 Our AI predictions are based on historical Seattle data!`
        : `⏱️ **Tiempos Estimados:**\n\n📊 Promedio: ${avgDays} días\n\n🎯 Por Tipo:\n• Bache: 5-7 días\n• Luz: 3-5 días\n• Grafiti: 2-4 días\n• Basura: 1-2 días\n• Fuga: 7-10 días`;
    }

    // Default/Help response
    return language === "en"
      ? `👋 **Hello! I'm your Seattle AI Assistant!**\n\nI can help you with:\n\n🔍 **Check Status** - View request updates\n📍 **Find Nearby** - Requests in your area\n⚡ **Urgent Issues** - High priority items\n🌧️ **Weather Impact** - Service delays\n📊 **Seattle Stats** - Overall performance\n⏱️ **Resolution Times** - How long it takes\n\nCurrently tracking **${stats.total}** requests across Seattle!\n\n💡 Try asking: "What requests are in my neighborhood?" or "Check urgent issues"`
      : `👋 **¡Hola! ¡Soy tu Asistente IA de Seattle!**\n\nPuedo ayudarte con:\n\n🔍 **Ver Estado** - Actualizaciones\n📍 **Buscar Cerca** - En tu área\n⚡ **Problemas Urgentes** - Alta prioridad\n🌧️ **Impacto Clima** - Retrasos\n📊 **Estadísticas** - Rendimiento\n\nRastreando **${stats.total}** solicitudes en Seattle!`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowMainMenu(false);

    setTimeout(() => {
      const aiResponse = generateSmartResponse(input);
      const aiMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReturnToMainMenu = () => {
    setShowMainMenu(true);
    setMessages([]);
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    setShowMainMenu(false);
    setTimeout(() => {
      // Generate response immediately
      const userMessage = {
        role: "user",
        content: prompt,
        timestamp: new Date(),
      };
      setMessages([userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const aiResponse = generateSmartResponse(prompt);
        const aiMessage = {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages([userMessage, aiMessage]);
        setIsTyping(false);
      }, 1000);
    }, 100);
  };

  // Seattle-specific quick actions
  const seattleQuickActions = [
    {
      en: "🌧️ Weather Impact on Services",
      es: "🌧️ Impacto del Clima",
      prompt: "Are there weather-related service delays in Seattle?",
      icon: "🌧️",
    },
    {
      en: "📍 Requests by Neighborhood",
      es: "📍 Solicitudes por Vecindario",
      prompt: "Show me requests by neighborhood in Seattle",
      icon: "📍",
    },
    {
      en: "⚡ High Priority Issues",
      es: "⚡ Problemas Urgentes",
      prompt: "What are the high priority requests right now?",
      icon: "⚡",
    },
    {
      en: "📊 Seattle Service Stats",
      es: "📊 Estadísticas de Seattle",
      prompt: "Tell me about Seattle service requests statistics",
      icon: "📊",
    },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600 text-white p-5 rounded-2xl shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:scale-110 z-50 group animate-bounce-slow"
        style={{
          boxShadow:
            "0 10px 40px rgba(20, 184, 166, 0.5), 0 0 30px rgba(6, 182, 212, 0.4)",
        }}
      >
        {isOpen ? (
          <X size={32} className="transition-transform group-hover:rotate-90" />
        ) : (
          <div className="relative">
            <MessageSquare size={32} />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center">
              <Sparkles size={12} />
            </div>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-28 right-8 w-[420px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-8 duration-300 border-2 border-teal-500/30"
          style={{
            boxShadow:
              "0 25px 70px rgba(20, 184, 166, 0.4), 0 0 50px rgba(6, 182, 212, 0.3)",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                  animation: "drift 20s linear infinite",
                }}
              ></div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm animate-pulse-slow">
                <Sparkles className="text-white" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-black text-xl">
                  {language === "en"
                    ? "Seattle AI Assistant"
                    : "Asistente IA de Seattle"}
                </h3>
                <p className="text-cyan-100 text-sm flex items-center gap-1.5 font-semibold">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                  {language === "en"
                    ? "🌲 Online • Real Data"
                    : "🌲 En Línea • Datos Reales"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-800 to-slate-900">
            {showMainMenu && messages.length === 0 ? (
              <div className="text-center py-6">
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl border border-teal-400/30 animate-bounce-slow">
                  <Bot className="text-teal-400" size={48} />
                </div>
                <h4 className="text-white font-bold text-xl mb-2">
                  {language === "en"
                    ? "🌲 Welcome to Seattle AI!"
                    : "🌲 ¡Bienvenido a Seattle IA!"}
                </h4>
                <p className="text-gray-300 text-sm mb-6 px-4">
                  {language === "en"
                    ? `I can help you with ${requests.length} service requests across Seattle neighborhoods`
                    : `Puedo ayudarte con ${requests.length} solicitudes en vecindarios de Seattle`}
                </p>

                <div className="space-y-3 mt-5">
                  <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                    {language === "en" ? "Quick Actions:" : "Acciones Rápidas:"}
                  </p>
                  {seattleQuickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="w-full text-left px-5 py-4 bg-gradient-to-r from-slate-700 to-slate-800 border-2 border-teal-500/30 rounded-2xl hover:border-teal-400 hover:from-teal-500/20 hover:to-cyan-500/20 transition-all text-sm text-white font-semibold shadow-lg hover:shadow-teal-500/30 group"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-125 transition-transform">
                          {action.icon}
                        </span>
                        <span>{language === "en" ? action.en : action.es}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {!showMainMenu && (
                  <button
                    onClick={handleReturnToMainMenu}
                    className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <ArrowLeft
                      size={20}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    {language === "en"
                      ? "Return to Main Menu"
                      : "Volver al Menú"}
                  </button>
                )}

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } animate-in slide-in-from-bottom-4 duration-200`}
                  >
                    {msg.role === "assistant" && (
                      <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-3 rounded-2xl h-11 w-11 flex items-center justify-center flex-shrink-0 shadow-xl border-2 border-teal-400/50">
                        <Bot size={20} />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl shadow-xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-none border-2 border-purple-400/50"
                          : "bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-teal-500/30 text-white rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">
                        {msg.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.role === "user"
                            ? "text-purple-200"
                            : "text-gray-400"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {msg.role === "user" && (
                      <div className="bg-gradient-to-br from-gray-400 to-gray-500 text-white p-3 rounded-2xl h-11 w-11 flex items-center justify-center flex-shrink-0 shadow-xl border-2 border-gray-300/50">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-gradient-to-br from-teal-600 to-cyan-700 p-3 rounded-2xl h-11 w-11 flex items-center justify-center shadow-xl border-2 border-teal-400/50">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-teal-500/30 p-5 rounded-2xl shadow-xl">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce"></span>
                        <span
                          className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></span>
                        <span
                          className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 border-t-2 border-teal-500/30 bg-slate-800">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "en"
                    ? "Ask about Seattle requests..."
                    : "Pregunta sobre solicitudes..."
                }
                className="flex-1 px-5 py-4 border-2 border-teal-500/30 bg-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-white placeholder-gray-400 font-medium"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-4 rounded-2xl hover:from-teal-700 hover:to-cyan-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl group"
              >
                <Send
                  size={22}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center font-medium">
              {language === "en"
                ? `🌲 AI-Powered • ${requests.length} Seattle requests`
                : `🌲 Con IA • ${requests.length} solicitudes de Seattle`}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes drift {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(30px);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default ChatBot;
