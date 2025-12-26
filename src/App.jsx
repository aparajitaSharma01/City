import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ResidentView from "./components/ResidentView";
import StaffView from "./components/StaffView";
import ChatBot from "./components/ChatBot";
import RequestModal from "./components/RequestModal";
import SubmitRequestForm from "./components/SubmitRequestForm";
import DataSourceToggle from "./components/DataSourceToggle";
import LandingPage from "./components/LandingPage";
import { generateMockRequests } from "./utils/mockData";
import { fetchSeattleRequests } from "./utils/seattleDataAdapter";

function App() {
  const [view, setView] = useState("resident");
  const [language, setLanguage] = useState("en");
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [dataSource, setDataSource] = useState("mock");
  const [loading, setLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true); // ← CHANGED TO TRUE

  // Initialize data on mount
  useEffect(() => {
    loadData();
  }, [dataSource]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (dataSource === "seattle") {
        console.log("🔄 Fetching Seattle Open Data...");
        const seattleData = await fetchSeattleRequests(500);
        if (seattleData && seattleData.length > 0) {
          console.log("✅ Loaded", seattleData.length, "Seattle requests");
          setRequests(seattleData);
        } else {
          console.warn("⚠️ Seattle API returned no data, using mock data");
          setRequests(generateMockRequests());
        }
      } else {
        console.log("📊 Using mock data");
        setRequests(generateMockRequests());
      }
    } catch (error) {
      console.error("❌ Error loading data:", error);
      console.log("🔄 Falling back to mock data");
      setRequests(generateMockRequests());
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  const handleDataSourceToggle = (source) => {
    setDataSource(source);
  };

  const handleRefresh = () => {
    loadData();
  };

  // ← ADD THIS SECTION: Show landing page first
  if (showLanding) {
    return (
      <LandingPage 
        onEnterApp={() => setShowLanding(false)} 
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        view={view}
        setView={setView}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <DataSourceToggle
            dataSource={dataSource}
            onToggle={handleDataSourceToggle}
            onRefresh={handleRefresh}
            loading={loading}
            language={language}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                {language === "en" ? "Loading data..." : "Cargando datos..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {view === "resident" ? (
              <>
                <ResidentView
                  requests={requests}
                  language={language}
                  onSelectRequest={setSelectedRequest}
                  onOpenSubmitForm={() => setShowSubmitForm(true)}
                />
                <ChatBot requests={requests} language={language} />
              </>
            ) : (
              <StaffView requests={requests} language={language} />
            )}
          </>
        )}
      </main>

      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          language={language}
        />
      )}

      {showSubmitForm && (
        <SubmitRequestForm
          onClose={() => setShowSubmitForm(false)}
          onSubmit={handleSubmitRequest}
          language={language}
        />
      )}

            <footer className="bg-white border-t mt-12">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? "© 2025 CityPulse Connect. Built for Seattle City Hackathon 2025."
                        : "© 2025 CityPulse Connect. Construido para Seattle City Hackathon 2025."}
                    </p>
                    {dataSource === "seattle" && (
                      <p className="text-xs text-gray-500 mt-1">
                        {language === "en"
                          ? "Data source: data.seattle.gov"
                          : "Fuente de datos: data.seattle.gov"}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <a
                      href="https://data.seattle.gov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition"
                    >
                      {language === "en" ? "Open Data" : "Datos Abiertos"}
                    </a>
                    <a
                      href="https://www.seattle.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition"
                    >
                      {language === "en" ? "Seattle.gov" : "Seattle.gov"}
                    </a>
                    <button
                      onClick={() => setShowLanding(true)}
                      className="hover:text-blue-600 transition"
                    >
                      {language === "en" ? "Restart Tour" : "Reiniciar"}
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        );
      }
      
      export default App;