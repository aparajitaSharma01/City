// AI Prediction Engine for resolution times
export const predictResolutionTime = (request) => {
  const baseTime = {
    Pothole: 5,
    "Street Light": 3,
    Graffiti: 2,
    "Trash Pickup": 1,
    "Water Leak": 7,
    "Noise Complaint": 1,
  };

  const priorityMultiplier = {
    High: 0.5,
    Medium: 1,
    Low: 1.5,
  };

  const neighborhoodLoad = {
    Downtown: 1.2,
    Eastside: 1.3,
    Westside: 1.0,
    Northside: 0.9,
    Southside: 1.1,
  };

  const base = baseTime[request.type] || 5;
  const priorityMult = priorityMultiplier[request.priority] || 1;
  const locationMult = neighborhoodLoad[request.neighborhood] || 1;

  return Math.ceil(base * priorityMult * locationMult);
};

// Generate natural language status updates
export const generateAIUpdate = (request, language = "en") => {
  const estimatedDays = predictResolutionTime(request);

  const updates = {
    en: {
      Submitted: `Your ${request.type} request has been received and logged into our system. Our AI estimates resolution within ${estimatedDays} days based on current workload and priority level.`,
      Assigned: `Great news! Your request has been assigned to ${request.department}. A qualified team will be dispatched to address your ${request.type} within 24-48 hours. Estimated completion: ${estimatedDays} days.`,
      "In Progress": `Work is actively underway! Our ${request.department} team is on-site addressing your ${request.type} request. We expect to complete this within ${estimatedDays} days.`,
      Completed: `Your ${request.type} request at ${request.neighborhood} has been successfully resolved. Thank you for helping us keep our city in great shape! Please rate your experience if you have a moment.`,
    },
    es: {
      Submitted: `Su solicitud de ${request.type} ha sido recibida y registrada. Nuestra IA estima una resolución dentro de ${estimatedDays} días según la carga de trabajo actual.`,
      Assigned: `¡Buenas noticias! Su solicitud ha sido asignada a ${request.department}. Un equipo será enviado en 24-48 horas. Finalización estimada: ${estimatedDays} días.`,
      "In Progress": `¡El trabajo está en progreso! Nuestro equipo de ${request.department} está en el sitio atendiendo su solicitud de ${request.type}. Esperamos completar esto en ${estimatedDays} días.`,
      Completed: `Su solicitud de ${request.type} en ${request.neighborhood} ha sido resuelta exitosamente. ¡Gracias por ayudarnos a mantener nuestra ciudad en excelente forma!`,
    },
  };

  return updates[language]?.[request.status] || "Processing your request...";
};

// AI Chatbot response generator with real Seattle data insights
export const generateChatResponse = (message, requests, language = "en") => {
  const msg = message.toLowerCase();

  // Calculate real statistics from requests
  const stats = {
    total: requests.length,
    completed: requests.filter((r) => r.status === "Completed").length,
    inProgress: requests.filter((r) => r.status === "In Progress").length,
    assigned: requests.filter((r) => r.status === "Assigned").length,
    submitted: requests.filter((r) => r.status === "Submitted").length,
    neighborhoods: [...new Set(requests.map((r) => r.neighborhood))],
    topNeighborhood: getTopNeighborhood(requests),
    avgResolutionDays: calculateAvgResolution(requests),
    mostCommonType: getMostCommonType(requests),
    departments: [...new Set(requests.map((r) => r.department))],
    recentCount: requests.filter((r) => {
      const daysSince =
        (new Date() - new Date(r.submittedDate)) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length,
  };

  // Extract request ID if present
  const reqIdMatch = message.match(/(?:REQ-|SR)?\d{2}-\d{8}|\d{2}-\d+/i);

  // Check for specific request ID
  if (reqIdMatch) {
    const reqId = reqIdMatch[0].toUpperCase();
    const request = requests.find(
      (r) => r.id.includes(reqId) || reqId.includes(r.id.split("-")[1])
    );

    if (request) {
      return language === "en"
        ? `Found request ${request.id}!\n\n📍 Type: ${
            request.type
          }\n📊 Status: ${request.status}\n🏘️ Neighborhood: ${
            request.neighborhood
          }\n⏱️ Submitted: ${request.submittedDate.toLocaleDateString()}\n🏢 Department: ${
            request.department
          }\n\nThis request is currently ${request.status.toLowerCase()}. ${getStatusAdvice(
            request,
            language
          )}`
        : `¡Encontré la solicitud ${request.id}!\n\n📍 Tipo: ${
            request.type
          }\n📊 Estado: ${request.status}\n🏘️ Vecindario: ${
            request.neighborhood
          }\n⏱️ Enviado: ${request.submittedDate.toLocaleDateString()}\n🏢 Departamento: ${
            request.department
          }\n\nEsta solicitud está actualmente ${request.status.toLowerCase()}. ${getStatusAdvice(
            request,
            language
          )}`;
    } else {
      return language === "en"
        ? `I couldn't find request ID "${reqId}" in the current dataset. Please verify the ID format (e.g., 24-00123456) and try again, or ask about general Seattle service statistics.`
        : `No pude encontrar la solicitud "${reqId}" en el conjunto de datos actual. Verifique el formato del ID (ej: 24-00123456) e intente nuevamente, o pregunte sobre estadísticas generales de Seattle.`;
    }
  }

  // Status inquiry
  if (
    msg.includes("status") ||
    msg.includes("estado") ||
    msg.includes("how many")
  ) {
    return language === "en"
      ? `Here's the current status of Seattle service requests:\n\n✅ Completed: ${
          stats.completed
        } (${Math.round(
          (stats.completed / stats.total) * 100
        )}%)\n🔵 In Progress: ${stats.inProgress} (${Math.round(
          (stats.inProgress / stats.total) * 100
        )}%)\n🟡 Assigned: ${stats.assigned} (${Math.round(
          (stats.assigned / stats.total) * 100
        )}%)\n🔴 Submitted: ${stats.submitted} (${Math.round(
          (stats.submitted / stats.total) * 100
        )}%)\n\n📊 Total: ${stats.total} requests\n📅 Last 7 days: ${
          stats.recentCount
        } new requests`
      : `Aquí está el estado actual de las solicitudes de Seattle:\n\n✅ Completadas: ${
          stats.completed
        } (${Math.round(
          (stats.completed / stats.total) * 100
        )}%)\n🔵 En Progreso: ${stats.inProgress} (${Math.round(
          (stats.inProgress / stats.total) * 100
        )}%)\n🟡 Asignadas: ${stats.assigned} (${Math.round(
          (stats.assigned / stats.total) * 100
        )}%)\n🔴 Enviadas: ${stats.submitted} (${Math.round(
          (stats.submitted / stats.total) * 100
        )}%)\n\n📊 Total: ${stats.total} solicitudes\n📅 Últimos 7 días: ${
          stats.recentCount
        } nuevas solicitudes`;
  }

  // Time estimates
  if (
    msg.includes("how long") ||
    msg.includes("time") ||
    msg.includes("cuanto tiempo") ||
    msg.includes("cuando")
  ) {
    return language === "en"
      ? `Based on ${stats.total} Seattle requests:\n\n⏱️ Average Resolution: ${stats.avgResolutionDays} days\n\n📋 Typical times by type:\n• Potholes: 5-7 days\n• Street Lights: 3-5 days\n• Graffiti: 2-4 days\n• Trash Pickup: 1-2 days\n• Water Leaks: 7-10 days\n\n📈 Most common request: ${stats.mostCommonType}\n\nActual times vary based on priority, location, and department workload.`
      : `Basado en ${stats.total} solicitudes de Seattle:\n\n⏱️ Resolución Promedio: ${stats.avgResolutionDays} días\n\n📋 Tiempos típicos por tipo:\n• Baches: 5-7 días\n• Luces: 3-5 días\n• Grafiti: 2-4 días\n• Recolección: 1-2 días\n• Fugas: 7-10 días\n\n📈 Solicitud más común: ${stats.mostCommonType}\n\nLos tiempos reales varían según prioridad, ubicación y carga del departamento.`;
  }

  // Neighborhood inquiry
  if (
    msg.includes("neighborhood") ||
    msg.includes("area") ||
    msg.includes("vecindario") ||
    msg.includes("where")
  ) {
    return language === "en"
      ? `Seattle Neighborhood Data:\n\n🏘️ Neighborhoods tracked: ${
          stats.neighborhoods.length
        }\n🔝 Most requests: ${stats.topNeighborhood.name} (${
          stats.topNeighborhood.count
        } requests)\n\nTop 5 areas:\n${getTopNeighborhoods(requests, 5)
          .map((n, i) => `${i + 1}. ${n.name}: ${n.count} requests`)
          .join("\n")}\n\nNeed info about a specific neighborhood? Just ask!`
      : `Datos de Vecindarios de Seattle:\n\n🏘️ Vecindarios rastreados: ${
          stats.neighborhoods.length
        }\n🔝 Más solicitudes: ${stats.topNeighborhood.name} (${
          stats.topNeighborhood.count
        } solicitudes)\n\nTop 5 áreas:\n${getTopNeighborhoods(requests, 5)
          .map((n, i) => `${i + 1}. ${n.name}: ${n.count} solicitudes`)
          .join(
            "\n"
          )}\n\n¿Necesita información sobre un vecindario específico? ¡Solo pregunte!`;
  }

  // Department inquiry
  if (
    msg.includes("department") ||
    msg.includes("who handles") ||
    msg.includes("departamento")
  ) {
    const deptStats = getDepartmentStats(requests);
    return language === "en"
      ? `Seattle Departments Handling Requests:\n\n${deptStats
          .map(
            (d) =>
              `🏢 ${d.name}:\n   • ${d.count} requests (${d.percentage}%)\n   • ${d.completed} completed\n   • Avg time: ${d.avgDays} days`
          )
          .join(
            "\n\n"
          )}\n\nEach department specializes in different service types.`
      : `Departamentos de Seattle Manejando Solicitudes:\n\n${deptStats
          .map(
            (d) =>
              `🏢 ${d.name}:\n   • ${d.count} solicitudes (${d.percentage}%)\n   • ${d.completed} completadas\n   • Tiempo prom: ${d.avgDays} días`
          )
          .join(
            "\n\n"
          )}\n\nCada departamento se especializa en diferentes tipos de servicio.`;
  }

  // Submit new request
  if (
    msg.includes("submit") ||
    msg.includes("report") ||
    msg.includes("new") ||
    msg.includes("enviar") ||
    msg.includes("reportar")
  ) {
    return language === "en"
      ? `To submit a new service request:\n\n1️⃣ Click the "Submit New Service Request" button at the top\n2️⃣ Select your issue type\n3️⃣ Provide location details\n4️⃣ Add description and photos\n5️⃣ Submit!\n\nYou'll get a tracking number instantly. Based on current data, ${stats.recentCount} requests were submitted in the last 7 days.\n\n📱 You can also call 311 or use the Find It, Fix It app.`
      : `Para enviar una nueva solicitud de servicio:\n\n1️⃣ Haga clic en "Enviar Nueva Solicitud" en la parte superior\n2️⃣ Seleccione el tipo de problema\n3️⃣ Proporcione detalles de ubicación\n4️⃣ Agregue descripción y fotos\n5️⃣ ¡Envíe!\n\nObtendra un número de seguimiento instantáneamente. Según los datos actuales, se enviaron ${stats.recentCount} solicitudes en los últimos 7 días.\n\n📱 También puede llamar al 311 o usar la aplicación Find It, Fix It.`;
  }

  // General stats/Seattle info
  if (
    msg.includes("seattle") ||
    msg.includes("stats") ||
    msg.includes("tell me") ||
    msg.includes("cuéntame") ||
    msg.includes("estadísticas")
  ) {
    return language === "en"
      ? `📊 Seattle Service Request Overview:\n\n📈 Total Requests: ${
          stats.total
        }\n🏘️ Neighborhoods: ${stats.neighborhoods.length}\n🏢 Departments: ${
          stats.departments.length
        }\n🔝 Busiest Area: ${stats.topNeighborhood.name}\n📋 Most Common: ${
          stats.mostCommonType
        }\n⏱️ Avg Resolution: ${
          stats.avgResolutionDays
        } days\n📅 Recent (7 days): ${
          stats.recentCount
        } requests\n\n✅ ${Math.round(
          (stats.completed / stats.total) * 100
        )}% completion rate\n\nSeattle is actively managing service requests across the city!`
      : `📊 Resumen de Solicitudes de Seattle:\n\n📈 Total Solicitudes: ${
          stats.total
        }\n🏘️ Vecindarios: ${stats.neighborhoods.length}\n🏢 Departamentos: ${
          stats.departments.length
        }\n🔝 Área Más Ocupada: ${stats.topNeighborhood.name}\n📋 Más Común: ${
          stats.mostCommonType
        }\n⏱️ Resolución Prom: ${
          stats.avgResolutionDays
        } días\n📅 Recientes (7 días): ${
          stats.recentCount
        } solicitudes\n\n✅ ${Math.round(
          (stats.completed / stats.total) * 100
        )}% tasa de finalización\n\n¡Seattle está gestionando activamente las solicitudes en toda la ciudad!`;
  }

  // Help/default response
  return language === "en"
    ? `I'm here to help with Seattle service requests! I can:\n\n🔍 Check request status (provide ID like "24-00123456")\n📊 Show statistics and trends\n🏘️ Provide neighborhood insights\n⏱️ Estimate resolution times\n🏢 Explain department roles\n📝 Guide you through submitting requests\n\nCurrently tracking ${stats.total} requests across ${stats.neighborhoods.length} Seattle neighborhoods.\n\nWhat would you like to know?`
    : `¡Estoy aquí para ayudar con las solicitudes de Seattle! Puedo:\n\n🔍 Verificar estado (proporcione ID como "24-00123456")\n📊 Mostrar estadísticas y tendencias\n🏘️ Proporcionar información de vecindarios\n⏱️ Estimar tiempos de resolución\n🏢 Explicar roles de departamentos\n📝 Guiarlo para enviar solicitudes\n\nActualmente rastreando ${stats.total} solicitudes en ${stats.neighborhoods.length} vecindarios de Seattle.\n\n¿Qué le gustaría saber?`;
};

// Helper functions for real data analysis
function getTopNeighborhood(requests) {
  const counts = {};
  requests.forEach((r) => {
    counts[r.neighborhood] = (counts[r.neighborhood] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return { name: top?.[0] || "Unknown", count: top?.[1] || 0 };
}

function getTopNeighborhoods(requests, limit = 5) {
  const counts = {};
  requests.forEach((r) => {
    counts[r.neighborhood] = (counts[r.neighborhood] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function calculateAvgResolution(requests) {
  const completed = requests.filter(
    (r) => r.status === "Completed" && r.closedDate
  );
  if (completed.length === 0) return "5-7";

  const total = completed.reduce((sum, r) => {
    const days =
      (new Date(r.closedDate) - new Date(r.submittedDate)) /
      (1000 * 60 * 60 * 24);
    return sum + (days > 0 && days < 365 ? days : 0);
  }, 0);

  return Math.round(total / completed.length) || "5-7";
}

function getMostCommonType(requests) {
  const counts = {};
  requests.forEach((r) => {
    counts[r.type] = (counts[r.type] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top?.[0] || "Various types";
}

function getDepartmentStats(requests) {
  const deptData = {};
  requests.forEach((r) => {
    if (!deptData[r.department]) {
      deptData[r.department] = {
        count: 0,
        completed: 0,
        totalDays: 0,
        completedCount: 0,
      };
    }
    deptData[r.department].count++;
    if (r.status === "Completed") {
      deptData[r.department].completed++;
      if (r.closedDate) {
        const days =
          (new Date(r.closedDate) - new Date(r.submittedDate)) /
          (1000 * 60 * 60 * 24);
        if (days > 0 && days < 365) {
          deptData[r.department].totalDays += days;
          deptData[r.department].completedCount++;
        }
      }
    }
  });

  return Object.entries(deptData)
    .map(([name, data]) => ({
      name,
      count: data.count,
      completed: data.completed,
      percentage: Math.round((data.count / requests.length) * 100),
      avgDays:
        data.completedCount > 0
          ? Math.round(data.totalDays / data.completedCount)
          : 5,
    }))
    .sort((a, b) => b.count - a.count);
}

function getStatusAdvice(request, language) {
  const statusAdvice = {
    Submitted: {
      en: "It will be reviewed and assigned to the appropriate department soon.",
      es: "Será revisada y asignada al departamento apropiado pronto.",
    },
    Assigned: {
      en: "A team has been assigned and will begin work within 24-48 hours.",
      es: "Se ha asignado un equipo y comenzará a trabajar en 24-48 horas.",
    },
    "In Progress": {
      en: "Work is actively underway. It should be completed soon!",
      es: "¡El trabajo está en marcha activamente. Debería completarse pronto!",
    },
    Completed: {
      en: "This issue has been resolved. Thank you for your report!",
      es: "¡Este problema ha sido resuelto. ¡Gracias por su reporte!",
    },
  };

  return statusAdvice[request.status]?.[language] || "";
}

// Detect bottlenecks using AI analysis
export const detectBottlenecks = (requests) => {
  const bottlenecks = [];

  // Analyze by neighborhood
  const neighborhoods = requests.reduce((acc, r) => {
    if (!acc[r.neighborhood]) {
      acc[r.neighborhood] = { total: 0, pending: 0, avgAge: 0, ages: [] };
    }
    acc[r.neighborhood].total++;
    if (r.status !== "Completed") {
      acc[r.neighborhood].pending++;
      const age = Math.floor(
        (Date.now() - r.submittedDate) / (1000 * 60 * 60 * 24)
      );
      acc[r.neighborhood].ages.push(age);
    }
    return acc;
  }, {});

  Object.entries(neighborhoods).forEach(([name, data]) => {
    if (data.ages.length > 0) {
      data.avgAge = data.ages.reduce((a, b) => a + b, 0) / data.ages.length;
    }

    if (data.avgAge > 7 && data.pending > 5) {
      bottlenecks.push({
        type: "neighborhood",
        severity: "High",
        location: name,
        message: `${name} has ${
          data.pending
        } pending requests with average age of ${data.avgAge.toFixed(1)} days`,
        recommendation: `Recommend dispatching additional crew to ${name}. Consider temporary resource reallocation from lower-volume areas.`,
      });
    }
  });

  // Analyze by department
  const departments = requests.reduce((acc, r) => {
    if (!acc[r.department]) {
      acc[r.department] = { total: 0, completed: 0, inProgress: 0 };
    }
    acc[r.department].total++;
    if (r.status === "Completed") acc[r.department].completed++;
    if (r.status === "In Progress") acc[r.department].inProgress++;
    return acc;
  }, {});

  Object.entries(departments).forEach(([name, data]) => {
    const efficiency = (data.completed / data.total) * 100;

    if (efficiency < 40 && data.total > 5) {
      bottlenecks.push({
        type: "department",
        severity: "Medium",
        location: name,
        message: `${name} completion rate is ${efficiency.toFixed(0)}% with ${
          data.inProgress
        } requests in progress`,
        recommendation: `Review ${name} resource allocation and workflow. Consider process optimization or staff training.`,
      });
    }
  });

  // Analyze by request type
  const types = requests.reduce((acc, r) => {
    if (!acc[r.type]) {
      acc[r.type] = { total: 0, highPriority: 0, avgResolutionTime: 0 };
    }
    acc[r.type].total++;
    if (r.priority === "High") acc[r.type].highPriority++;
    return acc;
  }, {});

  Object.entries(types).forEach(([name, data]) => {
    if (data.highPriority > 3) {
      bottlenecks.push({
        type: "request_type",
        severity: "Medium",
        location: name,
        message: `${name} has ${data.highPriority} high-priority requests pending`,
        recommendation: `Prioritize ${name} requests. Consider proactive maintenance to reduce future incidents.`,
      });
    }
  });

  // Add some success stories
  const successDepts = Object.entries(departments)
    .filter(([_, data]) => data.completed / data.total > 0.7 && data.total > 5)
    .map(([name, data]) => ({
      type: "success",
      severity: "Low",
      location: name,
      message: `${name} maintains ${(
        (data.completed / data.total) *
        100
      ).toFixed(0)}% completion rate`,
      recommendation: `Excellent performance! Document ${name}'s best practices for other departments.`,
    }));

  return [...bottlenecks, ...successDepts].slice(0, 5);
};

export default {
  predictResolutionTime,
  generateAIUpdate,
  generateChatResponse,
  detectBottlenecks,
};
