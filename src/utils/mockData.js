// Mock data generator for service requests
export const generateMockRequests = () => {
  const types = [
    "Pothole",
    "Street Light",
    "Graffiti",
    "Trash Pickup",
    "Water Leak",
    "Noise Complaint",
  ];
  const statuses = ["Submitted", "In Progress", "Assigned", "Completed"];
  const departments = ["Public Works", "Utilities", "Sanitation", "Police"];
  const neighborhoods = [
    "Downtown",
    "Eastside",
    "Westside",
    "Northside",
    "Southside",
  ];

  // Generate Seattle-style request IDs (YY-XXXXXXXX)
  const currentYear = new Date().getFullYear().toString().slice(-2);

  return Array.from({ length: 45 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const lat = 47.6062 + (Math.random() - 0.5) * 0.2; // Seattle latitude range
    const lng = -122.3321 + (Math.random() - 0.5) * 0.2; // Seattle longitude range

    // Seattle-style request number: YY-XXXXXXXX
    const requestNum = `${currentYear}-${String(10000000 + i).padStart(
      8,
      "0"
    )}`;

    return {
      id: requestNum,
      type,
      description: `${type} reported on ${
        ["Main St", "Oak Ave", "Elm Rd", "Pine Blvd"][
          Math.floor(Math.random() * 4)
        ]
      }`,
      status,
      department: departments[Math.floor(Math.random() * departments.length)],
      neighborhood:
        neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
      submittedDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      estimatedDays: Math.floor(Math.random() * 10) + 1,
      priority:
        Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
      lat,
      lng,
      reportedBy: `Resident ${Math.floor(Math.random() * 1000)}`,
      lastUpdated: new Date(
        Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000
      ),
      address: `${Math.floor(Math.random() * 9999) + 1} ${
        ["Main St", "Oak Ave", "Elm Rd", "Pine Blvd"][
          Math.floor(Math.random() * 4)
        ]
      }, Seattle, WA 981${Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, "0")}`,
    };
  });
};

// Generate trend data for charts
export const generateTrendData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    requests: Math.floor(Math.random() * 20) + 10,
    completed: Math.floor(Math.random() * 15) + 5,
    pending: Math.floor(Math.random() * 10) + 2,
  }));
};

// Department performance data
export const generateDepartmentData = (requests) => {
  const byDepartment = requests.reduce((acc, r) => {
    if (!acc[r.department]) {
      acc[r.department] = { total: 0, completed: 0, inProgress: 0 };
    }
    acc[r.department].total++;
    if (r.status === "Completed") acc[r.department].completed++;
    if (r.status === "In Progress") acc[r.department].inProgress++;
    return acc;
  }, {});

  return Object.entries(byDepartment).map(([name, data]) => ({
    name,
    total: data.total,
    completed: data.completed,
    inProgress: data.inProgress,
    efficiency: Math.round((data.completed / data.total) * 100),
  }));
};

// Neighborhood hotspot data
export const generateNeighborhoodData = (requests) => {
  const byNeighborhood = requests.reduce((acc, r) => {
    acc[r.neighborhood] = (acc[r.neighborhood] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(byNeighborhood)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// Status distribution
export const generateStatusData = (requests) => {
  const byStatus = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(byStatus).map(([name, value]) => ({ name, value }));
};

export default {
  generateMockRequests,
  generateTrendData,
  generateDepartmentData,
  generateNeighborhoodData,
  generateStatusData,
};
