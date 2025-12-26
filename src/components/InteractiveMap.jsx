import React, { useEffect, useRef, useState } from "react";
import { MapPin, Layers, Navigation } from "lucide-react";

const InteractiveMap = ({ requests, language, onSelectRequest }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS and JS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && mapInstance.current) {
      updateMarkers();
    }
  }, [requests, mapLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return;

    try {
      // Initialize map centered on Seattle
      const map = window.L.map(mapRef.current, {
        center: [47.6062, -122.3321],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
      });

      // Add beautiful tile layer
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
        minZoom: 10,
      }).addTo(map);

      // Set max bounds to Seattle area
      const seattleBounds = window.L.latLngBounds(
        [47.4899, -122.4362], // Southwest
        [47.7341, -122.241] // Northeast
      );
      map.setMaxBounds(seattleBounds);

      mapInstance.current = map;
      setMapLoaded(true);

      // Add legend
      addLegend(map);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const updateMarkers = () => {
    if (!mapInstance.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Status colors
    const statusColors = {
      Completed: "#10b981",
      "In Progress": "#06b6d4",
      Assigned: "#f59e0b",
      Submitted: "#f43f5e",
    };

    const statusIcons = {
      Completed: "✓",
      "In Progress": "⚡",
      Assigned: "📋",
      Submitted: "●",
    };

    // Group nearby markers to prevent clustering
    const markerGroups = {};
    const gridSize = 0.005; // ~500 meters

    requests.forEach((req) => {
      if (!req.lat || !req.lng) return;

      // Create grid key for grouping
      const gridLat = Math.floor(req.lat / gridSize) * gridSize;
      const gridLng = Math.floor(req.lng / gridSize) * gridSize;
      const gridKey = `${gridLat}_${gridLng}`;

      if (!markerGroups[gridKey]) {
        markerGroups[gridKey] = [];
      }
      markerGroups[gridKey].push(req);
    });

    // Add markers for each group
    Object.values(markerGroups).forEach((group) => {
      if (group.length === 1) {
        // Single marker
        const req = group[0];
        addSingleMarker(req, statusColors, statusIcons);
      } else {
        // Cluster marker
        const avgLat = group.reduce((sum, r) => sum + r.lat, 0) / group.length;
        const avgLng = group.reduce((sum, r) => sum + r.lng, 0) / group.length;
        addClusterMarker(avgLat, avgLng, group, statusColors);
      }
    });
  };

  const addSingleMarker = (req, statusColors, statusIcons) => {
    const color = statusColors[req.status] || "#6b7280";
    const icon = statusIcons[req.status] || "●";

    const customIcon = window.L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.3s;
        " onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'">
          ${icon}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = window.L.marker([req.lat, req.lng], {
      icon: customIcon,
    }).addTo(mapInstance.current);

    marker.bindPopup(
      `
      <div style="padding: 12px; min-width: 280px; font-family: system-ui;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="font-size: 20px;">${icon}</div>
          <h3 style="margin: 0; color: ${color}; font-size: 18px; font-weight: bold;">${
        req.id
      }</h3>
        </div>
        <div style="space-y: 8px;">
          <p style="margin: 6px 0; font-size: 14px;"><strong>📍 Type:</strong> ${
            req.type
          }</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>🏘️ Neighborhood:</strong> ${
            req.neighborhood
          }</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>📮 Address:</strong> ${
            req.address || "N/A"
          }</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>🏢 Department:</strong> ${
            req.department
          }</p>
          <div style="margin-top: 10px; padding: 8px; background: ${color}20; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: ${color};">Status: ${
        req.status
      }</p>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">📍 Coordinates: ${req.lat.toFixed(
            4
          )}, ${req.lng.toFixed(4)}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">📅 Submitted: ${new Date(
            req.submittedDate
          ).toLocaleDateString()}</p>
        </div>
        <button 
          onclick="alert('Request ${req.id} details')"
          style="margin-top: 12px; width: 100%; padding: 10px; background: linear-gradient(135deg, #14b8a6, #06b6d4); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;"
        >
          View Full Details
        </button>
      </div>
    `,
      { maxWidth: 320 }
    );

    marker.on("click", () => {
      if (onSelectRequest) {
        onSelectRequest(req);
      }
    });

    markersRef.current.push(marker);
  };

  const addClusterMarker = (lat, lng, group, statusColors) => {
    const statusCount = {};
    group.forEach((req) => {
      statusCount[req.status] = (statusCount[req.status] || 0) + 1;
    });

    const dominantStatus = Object.entries(statusCount).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    const color = statusColors[dominantStatus] || "#6b7280";

    const customIcon = window.L.divIcon({
      className: "custom-cluster-marker",
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          cursor: pointer;
        ">
          ${group.length}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(
      mapInstance.current
    );

    const popupContent = `
      <div style="padding: 12px; min-width: 250px; font-family: system-ui;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold;">📍 ${
          group.length
        } Requests in this area</h3>
        <div style="max-height: 200px; overflow-y: auto;">
          ${group
            .map(
              (req) => `
            <div style="padding: 8px; margin: 6px 0; background: #f3f4f6; border-radius: 8px; border-left: 4px solid ${
              statusColors[req.status]
            };">
              <p style="margin: 0; font-weight: bold; font-size: 13px;">${
                req.id
              }</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${
                req.type
              } - ${req.status}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 300, maxHeight: 300 });
    markersRef.current.push(marker);
  };

  const addLegend = (map) => {
    const legend = window.L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = window.L.DomUtil.create("div", "legend");

      const statusCounts = {
        Submitted: requests.filter((r) => r.status === "Submitted").length,
        Assigned: requests.filter((r) => r.status === "Assigned").length,
        "In Progress": requests.filter((r) => r.status === "In Progress")
          .length,
        Completed: requests.filter((r) => r.status === "Completed").length,
      };

      div.innerHTML = `
        <h4 style="margin: 0 0 12px 0; font-weight: bold; color: #0d9488;">Request Status</h4>
        <div class="legend-item">
          <div class="legend-dot" style="background: #f43f5e;"></div>
          <span>● Submitted (${statusCounts["Submitted"]})</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #f59e0b;"></div>
          <span>📋 Assigned (${statusCounts["Assigned"]})</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #06b6d4;"></div>
          <span>⚡ In Progress (${statusCounts["In Progress"]})</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #10b981;"></div>
          <span>✓ Completed (${statusCounts["Completed"]})</span>
        </div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #666;">
          <strong>Total:</strong> ${requests.length} requests
        </div>
      `;
      return div;
    };

    legend.addTo(map);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-teal-100">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {language === "en"
                ? "🗺️ Real Seattle Map"
                : "🗺️ Mapa Real de Seattle"}
            </h3>
            <p className="text-sm text-gray-600">
              {language === "en"
                ? `${requests.length} requests • OpenStreetMap`
                : `${requests.length} solicitudes • OpenStreetMap`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 rounded-xl text-sm font-bold shadow-md">
            <Layers size={16} className="inline mr-2" />
            {language === "en" ? "Interactive" : "Interactivo"}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="h-[600px] w-full rounded-2xl shadow-2xl border-4 border-teal-200"
        style={{ zIndex: 1 }}
      ></div>

      {/* Instructions */}
      <div className="mt-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4">
        <p className="text-sm text-gray-800 font-medium">
          <span className="font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {language === "en"
              ? "🗺️ Real Seattle Map:"
              : "🗺️ Mapa Real de Seattle:"}
          </span>{" "}
          {language === "en"
            ? "🖱️ Drag to explore • 🔍 Zoom to see street-level detail • 📍 Click markers for full request info • Numbers show clustered requests"
            : "🖱️ Arrastra para explorar • 🔍 Zoom para ver detalles • 📍 Haz clic para información • Números muestran agrupaciones"}
        </p>
      </div>
    </div>
  );
};

export default InteractiveMap;
