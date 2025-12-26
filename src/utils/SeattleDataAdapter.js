// Seattle Open Data API Adapter
// Data sources:
// 1. Customer Service Requests: https://data.seattle.gov/resource/5ngg-rpne.json
// 2. Request Tracking Data: https://data.seattle.gov/resource/43nw-pkdq.json

const SEATTLE_API_BASE = "https://data.seattle.gov/resource";
const REQUESTS_ENDPOINT = "/5ngg-rpne.json"; // Customer Service Requests
const TRACKING_ENDPOINT = "/43nw-pkdq.json"; // Request Tracking Data

/**
 * Fetch Seattle customer service requests
 * Uses Socrata SODA API with SoQL queries
 * @param {number} limit - Number of records to fetch (max 50000)
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Array>} Normalized request data
 */
export const fetchSeattleRequests = async (limit = 500, status = null) => {
  try {
    // Strategy: Fetch requests with variety of statuses to show all features
    // We'll fetch multiple batches with different statuses and combine them

    const allRequests = [];

    if (!status) {
      // Fetch a mix of different statuses for a complete view
      const statusesToFetch = [
        { status: "Closed", limit: Math.floor(limit * 0.4) }, // 40% closed
        { status: "Reported", limit: Math.floor(limit * 0.3) }, // 30% reported/new
        { status: "Open", limit: Math.floor(limit * 0.2) }, // 20% open
        { status: null, limit: Math.floor(limit * 0.1) }, // 10% any status
      ];

      for (const statusConfig of statusesToFetch) {
        const batchLimit = statusConfig.limit;
        let url = `${SEATTLE_API_BASE}${REQUESTS_ENDPOINT}?$limit=${batchLimit}&$order=createddate DESC`;

        // Add date filter for recent data (last 2 years)
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        const dateFilter = twoYearsAgo.toISOString().split("T")[0];

        if (statusConfig.status) {
          url += `&$where=servicerequeststatusname='${statusConfig.status}' AND createddate>'${dateFilter}'`;
        } else {
          url += `&$where=createddate>'${dateFilter}'`;
        }

        console.log(
          `Fetching ${batchLimit} records for status: ${
            statusConfig.status || "any"
          }...`
        );

        try {
          const response = await fetch(url);
          if (response.ok) {
            const batch = await response.json();
            console.log(
              `✓ Fetched ${batch.length} records for ${
                statusConfig.status || "any"
              }`
            );
            allRequests.push(...batch);
          } else {
            console.warn(
              `Failed to fetch batch for status ${statusConfig.status}: ${response.status}`
            );
          }
        } catch (error) {
          console.warn(
            `Error fetching batch for status ${statusConfig.status}:`,
            error
          );
        }

        // Small delay between requests to be nice to the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } else {
      // Single status requested
      let url = `${SEATTLE_API_BASE}${REQUESTS_ENDPOINT}?$limit=${limit}&$order=createddate DESC`;

      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      const dateFilter = twoYearsAgo.toISOString().split("T")[0];

      url += `&$where=servicerequeststatusname='${status}' AND createddate>'${dateFilter}'`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allRequests.push(...data);
    }

    console.log("✅ Seattle API total fetched:", allRequests.length, "records");

    // Remove duplicates based on service request number
    const uniqueRequests = Array.from(
      new Map(
        allRequests.map((req) => [req.servicerequestnumber, req])
      ).values()
    );

    console.log(
      "✅ After deduplication:",
      uniqueRequests.length,
      "unique records"
    );

    return uniqueRequests.slice(0, limit).map(normalizeSeattleRequest);
  } catch (error) {
    console.error("❌ Error fetching Seattle data:", error);
    return [];
  }
};

/**
 * Fetch tracking data for a specific request
 * @param {string} serviceRequestNumber - Seattle Service Request Number
 * @returns {Promise<Array>} Tracking history
 */
export const fetchRequestTracking = async (serviceRequestNumber) => {
  try {
    const url = `${SEATTLE_API_BASE}${TRACKING_ENDPOINT}?service_request_number=${serviceRequestNumber}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map(normalizeTrackingData);
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return [];
  }
};

/**
 * Normalize Seattle request data to our app format
 * Real Seattle field names from the API:
 * - servicerequestnumber (e.g., "21-00000002")
 * - webintakeservicerequests (request type)
 * - departmentname (e.g., "SPD-Seattle Police Department")
 * - createddate (ISO timestamp)
 * - methodreceivedname (e.g., "Citizen Web", "Find It Fix It Apps")
 * - servicerequeststatusname (e.g., "Closed", "Reported", "Transferred")
 * - location (address string)
 * - latitude, longitude (numbers)
 * - zipcode, councildistrict, policeprecinct, neighborhood
 */
const normalizeSeattleRequest = (seattleRequest) => {
  // Map Seattle status to our statuses
  // Seattle uses various status values - map them all
  const statusMap = {
    // Initial submission statuses
    Reported: "Submitted",
    Open: "Submitted",
    New: "Submitted",
    Received: "Submitted",

    // Assignment/routing statuses
    Assigned: "Assigned",
    "Transferred to Other Dept": "Assigned",
    Routed: "Assigned",
    Pending: "Assigned",

    // Work in progress statuses
    "In Progress": "In Progress",
    "Work in Progress": "In Progress",
    Started: "In Progress",
    Active: "In Progress",

    // Completion statuses
    Closed: "Completed",
    Resolved: "Completed",
    Complete: "Completed",
    Completed: "Completed",
    Done: "Completed",
    Finished: "Completed",
  };

  // Extract department short name from full name
  const getDepartmentShortName = (fullName) => {
    if (!fullName) return "Public Works";
    if (fullName.includes("SPD") || fullName.includes("Police"))
      return "Police";
    if (fullName.includes("SDOT") || fullName.includes("Transportation"))
      return "Public Works";
    if (fullName.includes("SPU") || fullName.includes("Utilities"))
      return "Utilities";
    if (fullName.includes("SCL") || fullName.includes("City Light"))
      return "Utilities";
    if (fullName.includes("FAS") || fullName.includes("Finance"))
      return "Public Works";
    return "Public Works";
  };

  // Determine priority based on request type
  const determinePriority = (requestType) => {
    if (!requestType) return "Medium";

    const highPriorityTypes = [
      "Water Main Break",
      "Sewer",
      "Dangerous",
      "Hazard",
      "Emergency",
      "Traffic Signal",
    ];

    const lowPriorityTypes = ["General Inquiry", "Information", "Question"];

    if (highPriorityTypes.some((type) => requestType.includes(type))) {
      return "High";
    }

    if (lowPriorityTypes.some((type) => requestType.includes(type))) {
      return "Low";
    }

    return "Medium";
  };

  // Parse dates safely
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    try {
      return new Date(dateString);
    } catch (e) {
      return new Date();
    }
  };

  const requestType =
    seattleRequest.webintakeservicerequests || "General Request";
  const seattleStatus = seattleRequest.servicerequeststatusname || "Reported";
  const createdDate = parseDate(seattleRequest.createddate);

  // Map status to our system
  let mappedStatus = statusMap[seattleStatus] || "Submitted";

  // DEMO ENHANCEMENT: If most requests are same status, simulate realistic distribution
  // This helps show all features during demo even if Seattle data is mostly "Closed"
  // Comment out these lines if you want pure Seattle data
  const daysOld = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
  if (seattleStatus === "Closed" || seattleStatus === "Reported") {
    // Distribute closed requests across different stages based on age
    const random = Math.random();
    if (daysOld < 30) {
      // Recent requests: show variety
      if (random < 0.3) mappedStatus = "Submitted";
      else if (random < 0.5) mappedStatus = "Assigned";
      else if (random < 0.7) mappedStatus = "In Progress";
      else mappedStatus = "Completed";
    } else if (daysOld < 90) {
      // Medium age: mostly in progress or completed
      if (random < 0.2) mappedStatus = "Assigned";
      else if (random < 0.5) mappedStatus = "In Progress";
      else mappedStatus = "Completed";
    }
    // Older requests stay as completed
  }

  return {
    id: seattleRequest.servicerequestnumber || `SEA-${Date.now()}`,
    type: requestType,
    description: `${requestType} - ${
      seattleRequest.location || "Location not specified"
    }`,
    status: mappedStatus,
    department: getDepartmentShortName(seattleRequest.departmentname),
    neighborhood: seattleRequest.neighborhood || "Other",
    submittedDate: createdDate,
    priority: determinePriority(requestType),
    lat: parseFloat(seattleRequest.latitude) || 47.6062,
    lng: parseFloat(seattleRequest.longitude) || -122.3321,
    reportedBy: seattleRequest.methodreceivedname || "Seattle Resident",
    lastUpdated: createdDate,
    address: seattleRequest.location || "Address not provided",
    closedDate: mappedStatus === "Completed" ? createdDate : null,

    // Seattle-specific fields preserved
    seattleData: {
      originalStatus: seattleStatus,
      department: seattleRequest.departmentname,
      method: seattleRequest.methodreceivedname,
      zipcode: seattleRequest.zipcode,
      councilDistrict: seattleRequest.councildistrict,
      policePrecinct: seattleRequest.policeprecinct,
    },
  };
};

/**
 * Normalize tracking data from Seattle Tracking API
 */
const normalizeTrackingData = (tracking) => {
  return {
    timestamp: new Date(tracking.status_date_time || tracking.createddate),
    status: tracking.status_description || tracking.status,
    notes: tracking.status_notes || "",
    updatedBy: tracking.updated_by || "System",
  };
};

/**
 * Calculate comprehensive statistics from Seattle data
 */
export const calculateSeattleStats = (requests) => {
  const now = new Date();

  const stats = {
    total: requests.length,
    open: 0,
    closed: 0,
    avgResolutionDays: 0,
    byType: {},
    byNeighborhood: {},
    byDepartment: {},
    byMonth: {},
    responseTimesByType: {},
    byMethod: {},
  };

  let totalResolutionDays = 0;
  let closedCount = 0;

  requests.forEach((req) => {
    // Count by status
    if (req.status === "Completed") {
      stats.closed++;

      // Calculate resolution time
      if (req.closedDate && req.submittedDate) {
        const days =
          (req.closedDate - req.submittedDate) / (1000 * 60 * 60 * 24);
        if (days >= 0 && days < 365) {
          // Sanity check
          totalResolutionDays += days;
          closedCount++;

          // Track by type
          if (!stats.responseTimesByType[req.type]) {
            stats.responseTimesByType[req.type] = [];
          }
          stats.responseTimesByType[req.type].push(days);
        }
      }
    } else {
      stats.open++;
    }

    // Count by type
    stats.byType[req.type] = (stats.byType[req.type] || 0) + 1;

    // Count by neighborhood
    stats.byNeighborhood[req.neighborhood] =
      (stats.byNeighborhood[req.neighborhood] || 0) + 1;

    // Count by department
    stats.byDepartment[req.department] =
      (stats.byDepartment[req.department] || 0) + 1;

    // Count by submission method
    const method = req.reportedBy;
    stats.byMethod[method] = (stats.byMethod[method] || 0) + 1;

    // Count by month
    const month = req.submittedDate.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
    stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
  });

  stats.avgResolutionDays =
    closedCount > 0 ? (totalResolutionDays / closedCount).toFixed(1) : 0;

  return stats;
};

/**
 * Search requests by keyword
 */
export const searchRequests = (requests, keyword) => {
  if (!keyword || keyword.trim() === "") {
    return requests;
  }

  const searchTerm = keyword.toLowerCase();

  return requests.filter(
    (req) =>
      req.id.toLowerCase().includes(searchTerm) ||
      req.type.toLowerCase().includes(searchTerm) ||
      req.description.toLowerCase().includes(searchTerm) ||
      req.neighborhood.toLowerCase().includes(searchTerm) ||
      req.address.toLowerCase().includes(searchTerm) ||
      req.department.toLowerCase().includes(searchTerm)
  );
};

/**
 * Get unique request types from Seattle data
 */
export const getRequestTypes = (requests) => {
  const types = new Set(requests.map((r) => r.type));
  return Array.from(types).sort();
};

/**
 * Get unique neighborhoods from Seattle data
 */
export const getNeighborhoods = (requests) => {
  const neighborhoods = new Set(requests.map((r) => r.neighborhood));
  return Array.from(neighborhoods).sort();
};

/**
 * Submit new request to Seattle (mock implementation for hackathon)
 * In production, this would POST to Seattle's CSR intake system
 */
export const submitSeattleRequest = async (requestData) => {
  // Mock implementation - in production, integrate with Seattle's submission API
  console.log("Would submit to Seattle CSR system:", requestData);

  // Generate Seattle-style request number (YY-XXXXXXXX)
  const year = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  const requestNumber = `${year}-${randomNum}`;

  return {
    success: true,
    requestNumber,
    message:
      "Request submitted successfully to Seattle Customer Service Bureau",
    estimatedResolutionDays: 5,
  };
};

/**
 * Test API connection
 */
export const testSeattleConnection = async () => {
  try {
    const url = `${SEATTLE_API_BASE}${REQUESTS_ENDPOINT}?$limit=1`;
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error("Seattle API connection test failed:", error);
    return false;
  }
};

export default {
  fetchSeattleRequests,
  fetchRequestTracking,
  calculateSeattleStats,
  submitSeattleRequest,
  searchRequests,
  getRequestTypes,
  getNeighborhoods,
  testSeattleConnection,
};
