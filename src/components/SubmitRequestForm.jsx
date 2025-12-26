import React, { useState } from "react";
import { X, MapPin, Upload, AlertCircle, CheckCircle } from "lucide-react";

const SubmitRequestForm = ({ onClose, onSubmit, language }) => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    address: "",
    neighborhood: "",
    priority: "Medium",
    reporterName: "",
    reporterEmail: "",
    reporterPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const requestTypes = [
    { en: "Pothole", es: "Bache" },
    { en: "Street Light", es: "Luz de Calle" },
    { en: "Graffiti", es: "Grafiti" },
    { en: "Trash Pickup", es: "Recolección de Basura" },
    { en: "Water Leak", es: "Fuga de Agua" },
    { en: "Noise Complaint", es: "Queja de Ruido" },
    { en: "Other", es: "Otro" },
  ];

  const neighborhoods = [
    "Downtown",
    "Capitol Hill",
    "Ballard",
    "Fremont",
    "Queen Anne",
    "Wallingford",
    "University District",
    "Georgetown",
    "West Seattle",
    "Beacon Hill",
    "Greenwood",
    "Ravenna",
    "Madison Park",
    "Magnolia",
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.type)
      newErrors.type =
        language === "en"
          ? "Request type is required"
          : "Tipo de solicitud requerido";
    if (!formData.description || formData.description.length < 10) {
      newErrors.description =
        language === "en"
          ? "Description must be at least 10 characters"
          : "La descripción debe tener al menos 10 caracteres";
    }
    if (!formData.address)
      newErrors.address =
        language === "en" ? "Address is required" : "Dirección requerida";
    if (!formData.neighborhood)
      newErrors.neighborhood =
        language === "en" ? "Neighborhood is required" : "Vecindario requerido";
    if (!formData.reporterName)
      newErrors.reporterName =
        language === "en" ? "Name is required" : "Nombre requerido";
    if (!formData.reporterEmail) {
      newErrors.reporterEmail =
        language === "en" ? "Email is required" : "Email requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.reporterEmail)) {
      newErrors.reporterEmail =
        language === "en"
          ? "Invalid email format"
          : "Formato de email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newRequest = {
        id: `24-${String(Math.floor(Math.random() * 100000000)).padStart(
          8,
          "0"
        )}`,
        type: formData.type,
        description: formData.description,
        address: formData.address,
        neighborhood: formData.neighborhood,
        priority: formData.priority,
        status: "Submitted",
        submittedDate: new Date(),
        lastUpdated: new Date(),
        reportedBy: formData.reporterName,
        lat: 47.6062 + (Math.random() - 0.5) * 0.2,
        lng: -122.3321 + (Math.random() - 0.5) * 0.2,
        department: getDepartment(formData.type),
      };

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Call parent submit handler
      if (onSubmit) {
        onSubmit(newRequest);
      }

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  const getDepartment = (type) => {
    const deptMap = {
      Pothole: "Transportation",
      "Street Light": "City Light",
      Graffiti: "Public Works",
      "Trash Pickup": "Waste Management",
      "Water Leak": "Seattle Public Utilities",
      "Noise Complaint": "Police Department",
      Other: "General Services",
    };
    return deptMap[type] || "General Services";
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-emerald-600" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "en" ? "Request Submitted!" : "¡Solicitud Enviada!"}
          </h3>
          <p className="text-gray-600 mb-4">
            {language === "en"
              ? "Your service request has been successfully submitted. You will receive updates via email."
              : "Su solicitud de servicio ha sido enviada exitosamente. Recibirá actualizaciones por correo electrónico."}
          </p>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              {language === "en"
                ? "Tracking Number:"
                : "Número de Seguimiento:"}
            </p>
            <p className="text-lg font-bold text-teal-600">
              24-
              {String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {language === "en"
                  ? "Submit Service Request"
                  : "Enviar Solicitud de Servicio"}
              </h2>
              <p className="text-teal-100 text-sm mt-1">
                {language === "en"
                  ? "Help us serve you better by providing detailed information"
                  : "Ayúdenos a servirle mejor proporcionando información detallada"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === "en" ? "Request Type *" : "Tipo de Solicitud *"}
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">
                {language === "en" ? "Select type..." : "Seleccionar tipo..."}
              </option>
              {requestTypes.map((type) => (
                <option key={type.en} value={type.en}>
                  {language === "en" ? type.en : type.es}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === "en" ? "Description *" : "Descripción *"}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              placeholder={
                language === "en"
                  ? "Describe the issue in detail..."
                  : "Describa el problema en detalle..."
              }
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description}</p>
              )}
              <p className="text-gray-400 text-xs ml-auto">
                {formData.description.length} / 500
              </p>
            </div>
          </div>

          {/* Address and Neighborhood */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Address *" : "Dirección *"}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="123 Main St, Seattle, WA"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === "en" ? "Neighborhood *" : "Vecindario *"}
              </label>
              <select
                value={formData.neighborhood}
                onChange={(e) => handleChange("neighborhood", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.neighborhood ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">
                  {language === "en" ? "Select..." : "Seleccionar..."}
                </option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {errors.neighborhood && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.neighborhood}
                </p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {language === "en" ? "Priority" : "Prioridad"}
            </label>
            <div className="flex gap-3">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleChange("priority", p)}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
                    formData.priority === p
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === "en"
                ? "Contact Information"
                : "Información de Contacto"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === "en" ? "Full Name *" : "Nombre Completo *"}
                </label>
                <input
                  type="text"
                  value={formData.reporterName}
                  onChange={(e) => handleChange("reporterName", e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.reporterName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.reporterName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.reporterName}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "en" ? "Email *" : "Correo *"}
                  </label>
                  <input
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) =>
                      handleChange("reporterEmail", e.target.value)
                    }
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.reporterEmail
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.reporterEmail && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.reporterEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === "en"
                      ? "Phone (Optional)"
                      : "Teléfono (Opcional)"}
                  </label>
                  <input
                    type="tel"
                    value={formData.reporterPhone}
                    onChange={(e) =>
                      handleChange("reporterPhone", e.target.value)
                    }
                    placeholder="(206) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-cyan-600 flex-shrink-0" size={20} />
              <p className="text-sm text-cyan-900">
                {language === "en"
                  ? "By submitting this request, you agree to receive updates via email. Your information is secure and will only be used for service delivery."
                  : "Al enviar esta solicitud, acepta recibir actualizaciones por correo electrónico. Su información es segura y solo se utilizará para la prestación de servicios."}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              {language === "en" ? "Cancel" : "Cancelar"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? language === "en"
                  ? "Submitting..."
                  : "Enviando..."
                : language === "en"
                ? "Submit Request"
                : "Enviar Solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitRequestForm;
