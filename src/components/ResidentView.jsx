import React, { useState, useMemo } from "react";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { predictResolutionTime } from "../utils/aiEngine";
import InteractiveMap from "./InteractiveMap";

const ResidentView = ({
  requests,
  language,
  onSelectRequest,
  onOpenSubmitForm,
}) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Calculate statistics
  const stats = useMemo(() => {
    const active = requests.filter((r) => r.status !== "Completed").length;
    const completed = requests.filter((r) => r.status === "Completed").length;
    const avgTime =
      requests
        .filter((r) => r.status === "Completed")
        .reduce((acc, r) => acc + predictResolutionTime(r), 0) /
      (completed || 1);

    return {
      active,
      completed,
      avgTime: avgTime.toFixed(1),
    };
  }, [requests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const statusMatch = filterStatus === "all" || r.status === filterStatus;
      const typeMatch = filterType === "all" || r.type === filterType;
      return statusMatch && typeMatch;
    });
  }, [requests, filterStatus, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterType]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800";
      case "In Progress":
        return "bg-cyan-100 text-cyan-800";
      case "Assigned":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-rose-100 text-rose-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-rose-100 text-rose-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {language === "en" ? "Active Requests" : "Solicitudes Activas"}
              </p>
              <p className="text-3xl font-bold text-teal-600">{stats.active}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <AlertCircle className="text-teal-600" size={32} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {language === "en"
              ? "Currently being processed"
              : "Procesándose actualmente"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {language === "en" ? "Avg Response Time" : "Tiempo Promedio"}
              </p>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.avgTime}{" "}
                <span className="text-lg">
                  {language === "en" ? "days" : "días"}
                </span>
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Clock className="text-emerald-600" size={32} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {language === "en"
              ? "AI-predicted resolution"
              : "Resolución predicha por IA"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {language === "en" ? "Completed" : "Completadas"}
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.completed}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle className="text-purple-600" size={32} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {language === "en"
              ? "Successfully resolved"
              : "Resueltas exitosamente"}
          </p>
        </div>
      </div>

      {/* Submit New Request Button - Updated Colors */}
      <button
        onClick={onOpenSubmitForm}
        className="w-full bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 relative overflow-hidden group"
      >
        {/* Animated background shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        <Plus size={24} className="relative z-10" />
        <div className="text-left relative z-10">
          <p className="text-lg font-bold">
            {language === "en"
              ? "Submit New Service Request"
              : "Enviar Nueva Solicitud"}
          </p>
          <p className="text-sm text-teal-100">
            {language === "en"
              ? "Report an issue in your neighborhood"
              : "Reportar un problema en su vecindario"}
          </p>
        </div>
      </button>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">
              {language === "en" ? "Filters:" : "Filtros:"}
            </span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">
              {language === "en" ? "All Status" : "Todos los Estados"}
            </option>
            <option value="Submitted">
              {language === "en" ? "Submitted" : "Enviado"}
            </option>
            <option value="In Progress">
              {language === "en" ? "In Progress" : "En Progreso"}
            </option>
            <option value="Assigned">
              {language === "en" ? "Assigned" : "Asignado"}
            </option>
            <option value="Completed">
              {language === "en" ? "Completed" : "Completado"}
            </option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">
              {language === "en" ? "All Types" : "Todos los Tipos"}
            </option>
            <option value="Pothole">
              {language === "en" ? "Pothole" : "Bache"}
            </option>
            <option value="Street Light">
              {language === "en" ? "Street Light" : "Luz de Calle"}
            </option>
            <option value="Graffiti">Graffiti</option>
            <option value="Trash Pickup">
              {language === "en" ? "Trash Pickup" : "Recolección"}
            </option>
            <option value="Water Leak">
              {language === "en" ? "Water Leak" : "Fuga de Agua"}
            </option>
            <option value="Noise Complaint">
              {language === "en" ? "Noise Complaint" : "Queja de Ruido"}
            </option>
          </select>

          <span className="text-sm text-gray-600 ml-auto">
            {filteredRequests.length}{" "}
            {language === "en" ? "results" : "resultados"}
          </span>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === "en"
                  ? "Your Service Requests"
                  : "Sus Solicitudes de Servicio"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {language === "en"
                  ? `Showing ${paginatedRequests.length} of ${filteredRequests.length} requests`
                  : `Mostrando ${paginatedRequests.length} de ${filteredRequests.length} solicitudes`}
              </p>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-700 font-medium px-3">
                  {language === "en" ? "Page" : "Página"} {currentPage}{" "}
                  {language === "en" ? "of" : "de"} {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="divide-y max-h-[600px] overflow-y-auto">
          {paginatedRequests.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">
                {language === "en"
                  ? "No requests found"
                  : "No se encontraron solicitudes"}
              </p>
            </div>
          ) : (
            paginatedRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => onSelectRequest(request)}
                className="p-4 hover:bg-teal-50 cursor-pointer transition-all duration-200 hover:shadow-inner"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-semibold text-teal-600 text-lg">
                        {request.id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          request.priority
                        )}`}
                      >
                        {request.priority}
                      </span>
                    </div>

                    <p className="text-sm text-gray-800 font-medium mb-1">
                      {request.type}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {request.description}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {request.neighborhood}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {language === "en" ? "Est." : "Est."}{" "}
                        {predictResolutionTime(request)}{" "}
                        {language === "en" ? "days" : "días"}
                      </span>
                      <span>
                        {language === "en" ? "Submitted" : "Enviado"}:{" "}
                        {request.submittedDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {request.department}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {language === "en"
                ? `Page ${currentPage} of ${totalPages} (${filteredRequests.length} total)`
                : `Página ${currentPage} de ${totalPages} (${filteredRequests.length} total)`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {language === "en" ? "First" : "Primera"}
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {language === "en" ? "Previous" : "Anterior"}
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {language === "en" ? "Next" : "Siguiente"}
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {language === "en" ? "Last" : "Última"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <InteractiveMap
        requests={filteredRequests}
        language={language}
        onSelectRequest={onSelectRequest}
      />
    </div>
  );
};

export default ResidentView;
