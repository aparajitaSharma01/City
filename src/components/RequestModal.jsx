import React from "react";
import {
  X,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
} from "lucide-react";
import { generateAIUpdate, predictResolutionTime } from "../utils/aiEngine";

const RequestModal = ({ request, onClose, language }) => {
  if (!request) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="text-green-600" size={24} />;
      case "In Progress":
        return <Clock className="text-blue-600 animate-spin" size={24} />;
      case "Assigned":
        return <AlertCircle className="text-yellow-600" size={24} />;
      default:
        return <AlertCircle className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Assigned":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-300";
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {request.id}
              </h2>
              <p className="text-blue-100 text-sm">
                {language === "en"
                  ? "Service Request Details"
                  : "Detalles de Solicitud"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="flex gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(
                request.status
              )}`}
            >
              {getStatusIcon(request.status)}
              <span className="font-semibold">{request.status}</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getPriorityColor(
                request.priority
              )}`}
            >
              <AlertCircle size={20} />
              <span className="font-semibold">{request.priority} Priority</span>
            </div>
          </div>

          {/* AI Update */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg flex-shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-semibold text-blue-900 mb-1">
                  {language === "en"
                    ? "AI-Generated Status Update"
                    : "Actualización de IA"}
                </p>
                <p className="text-blue-800 text-sm">
                  {generateAIUpdate(request, language)}
                </p>
              </div>
            </div>
          </div>

          {/* Request Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">
                  {language === "en" ? "Request Type" : "Tipo de Solicitud"}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {request.type}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin size={18} />
                <span className="text-sm font-medium">
                  {language === "en" ? "Location" : "Ubicación"}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {request.neighborhood}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <User size={18} />
                <span className="text-sm font-medium">
                  {language === "en" ? "Department" : "Departamento"}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {request.department}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock size={18} />
                <span className="text-sm font-medium">
                  {language === "en"
                    ? "Estimated Resolution"
                    : "Resolución Estimada"}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {predictResolutionTime(request)}{" "}
                {language === "en" ? "days" : "días"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === "en" ? "Description" : "Descripción"}
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {request.description}
            </p>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              {language === "en" ? "Timeline" : "Línea de Tiempo"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-full">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {language === "en" ? "Submitted" : "Enviado"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.submittedDate.toLocaleString(
                      language === "en" ? "en-US" : "es-ES",
                      {
                        dateStyle: "full",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-300 text-gray-700 p-2 rounded-full">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {language === "en"
                      ? "Last Updated"
                      : "Última Actualización"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.lastUpdated.toLocaleString(
                      language === "en" ? "en-US" : "es-ES",
                      {
                        dateStyle: "full",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                </div>
              </div>

              {request.status === "Completed" && (
                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white p-2 rounded-full">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {language === "en" ? "Completed" : "Completado"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? "Request successfully resolved"
                        : "Solicitud resuelta exitosamente"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === "en"
                ? "Additional Information"
                : "Información Adicional"}
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">
                  {language === "en" ? "Reported by:" : "Reportado por:"}
                </span>{" "}
                {request.reportedBy}
              </p>
              <p>
                <span className="font-medium">
                  {language === "en" ? "Coordinates:" : "Coordenadas:"}
                </span>{" "}
                {request.lat.toFixed(4)}, {request.lng.toFixed(4)}
              </p>
              {request.seattleData && (
                <>
                  <p>
                    <span className="font-medium">
                      {language === "en"
                        ? "Seattle Status:"
                        : "Estado de Seattle:"}
                    </span>{" "}
                    {request.seattleData.originalStatus}
                  </p>
                  {request.seattleData.department && (
                    <p>
                      <span className="font-medium">
                        {language === "en"
                          ? "Seattle Department:"
                          : "Departamento de Seattle:"}
                      </span>{" "}
                      {request.seattleData.department}
                    </p>
                  )}
                  {request.seattleData.method && (
                    <p>
                      <span className="font-medium">
                        {language === "en"
                          ? "Submission Method:"
                          : "Método de Envío:"}
                      </span>{" "}
                      {request.seattleData.method}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg"
          >
            {language === "en" ? "Close" : "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
