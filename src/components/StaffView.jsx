import React, { useMemo } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Target,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  generateTrendData,
  generateDepartmentData,
  generateNeighborhoodData,
  generateStatusData,
} from "../utils/mockData";
import { detectBottlenecks } from "../utils/aiEngine";

const StaffView = ({ requests, language }) => {
  const analytics = useMemo(() => {
    const completed = requests.filter((r) => r.status === "Completed").length;
    const inProgress = requests.filter(
      (r) => r.status === "In Progress"
    ).length;
    const pending = requests.filter((r) => r.status === "Submitted").length;
    const assigned = requests.filter((r) => r.status === "Assigned").length;

    const completionRate = ((completed / requests.length) * 100).toFixed(1);

    return {
      totalRequests: requests.length,
      completed,
      inProgress,
      pending,
      assigned,
      completionRate,
      trendData: generateTrendData(),
      departmentData: generateDepartmentData(requests),
      neighborhoodData: generateNeighborhoodData(requests),
      statusData: generateStatusData(requests),
      bottlenecks: detectBottlenecks(requests),
    };
  }, [requests]);

  const COLORS = {
    primary: ["#14b8a6", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899"],
    status: {
      completed: "#10b981",
      inProgress: "#06b6d4",
      assigned: "#f59e0b",
      submitted: "#f43f5e",
    },
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "from-rose-500 to-pink-500 border-rose-400";
      case "Medium":
        return "from-amber-500 to-orange-500 border-amber-400";
      default:
        return "from-emerald-500 to-teal-500 border-emerald-400";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "High":
        return <AlertTriangle className="text-white" size={28} />;
      case "Medium":
        return <Activity className="text-white" size={28} />;
      default:
        return <CheckCircle className="text-white" size={28} />;
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Requests",
            value: analytics.totalRequests,
            icon: Target,
            gradient: "from-teal-500 to-cyan-500",
            bgGradient: "from-teal-50 to-cyan-50",
            detail: "All time",
          },
          {
            label: "In Progress",
            value: analytics.inProgress,
            icon: Zap,
            gradient: "from-cyan-500 to-blue-500",
            bgGradient: "from-cyan-50 to-blue-50",
            detail: "Active now",
          },
          {
            label: "Completed",
            value: analytics.completed,
            icon: CheckCircle,
            gradient: "from-emerald-500 to-teal-500",
            bgGradient: "from-emerald-50 to-teal-50",
            detail: "Resolved",
          },
          {
            label: "Completion Rate",
            value: `${analytics.completionRate}%`,
            icon: Award,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            detail: "Efficiency",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`relative bg-gradient-to-br ${stat.bgGradient} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-white overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p
                      className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="text-white" size={28} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {stat.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Bottleneck Analysis - Enhanced */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl border-2 border-teal-500/30">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
            <TrendingUp className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              🤖 AI-Detected Bottlenecks
            </h3>
            <p className="text-cyan-300 text-sm font-semibold">
              Real-time intelligence & recommendations
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {analytics.bottlenecks.map((bottleneck, idx) => (
            <div
              key={idx}
              className={`relative p-6 rounded-2xl bg-gradient-to-r ${getSeverityColor(
                bottleneck.severity
              )} text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  {getSeverityIcon(bottleneck.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-black text-lg">
                      {bottleneck.severity} Priority
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                      {bottleneck.location}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold capitalize">
                      {bottleneck.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm mb-3 leading-relaxed font-medium">
                    {bottleneck.message}
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                    <p className="text-sm font-bold flex items-center gap-2">
                      💡 <span className="font-semibold">Recommendation:</span>
                    </p>
                    <p className="text-sm mt-1">{bottleneck.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-teal-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Request Trend (7 Days)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.trendData}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "2px solid #14b8a6",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#14b8a6"
                strokeWidth={3}
                fill="url(#colorRequests)"
                name="Total Requests"
                dot={{ fill: "#14b8a6", r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#colorCompleted)"
                name="Completed"
                dot={{ fill: "#10b981", r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Department Performance
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: "11px" }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "2px solid #a855f7",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
              <Legend />
              <Bar
                dataKey="completed"
                fill="#10b981"
                name="Completed"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="inProgress"
                fill="#f59e0b"
                name="In Progress"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution - Enhanced Pie Chart */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl border-2 border-cyan-500/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Activity className="text-white" size={20} />
            </div>
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analytics.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.primary[index % COLORS.primary.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "2px solid #06b6d4",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Neighborhood Hotspots */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Neighborhood Hotspots
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.neighborhoodData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                stroke="#6b7280"
                style={{ fontSize: "11px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "2px solid #10b981",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
              <Bar
                dataKey="value"
                fill="#14b8a6"
                name="Requests"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Efficiency Table - Ultra Modern */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Department Efficiency Metrics
            </h3>
            <p className="text-sm text-gray-600">
              Performance breakdown by team
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-teal-50 to-cyan-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 rounded-tl-xl">
                  Department
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                  Completed
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                  In Progress
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 rounded-tr-xl">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analytics.departmentData.map((dept, idx) => (
                <tr key={idx} className="hover:bg-teal-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                      {dept.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl font-bold text-gray-900">
                      {dept.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-800 shadow-md">
                      ✓ {dept.completed}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold bg-cyan-100 text-cyan-800 shadow-md">
                      ⚡ {dept.inProgress}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            dept.efficiency >= 70
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : dept.efficiency >= 40
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : "bg-gradient-to-r from-rose-500 to-pink-500"
                          }`}
                          style={{ width: `${dept.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="font-black text-gray-900 text-base min-w-[50px]">
                        {dept.efficiency}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights - Premium Design */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-teal-600 p-8 rounded-3xl shadow-2xl text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Award className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black">🎯 Key Insights & Actions</h3>
              <p className="text-white/80 text-sm">
                Data-driven recommendations
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
              <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                📈 Performance Trends
              </h4>
              <ul className="space-y-3 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">▸</span>
                  <span>
                    Overall completion rate:{" "}
                    <strong className="text-yellow-300">
                      {analytics.completionRate}%
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">▸</span>
                  <span>
                    <strong className="text-yellow-300">
                      {analytics.inProgress}
                    </strong>{" "}
                    requests currently active
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">▸</span>
                  <span>
                    7-day volume trending{" "}
                    <strong className="text-yellow-300">
                      ↑ {Math.floor(Math.random() * 15 + 5)}%
                    </strong>
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl">
              <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                💡 Recommended Actions
              </h4>
              <ul className="space-y-3 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-300">▸</span>
                  <span>
                    Review high-volume neighborhoods for resource allocation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-300">▸</span>
                  <span>
                    Consider cross-training staff for better efficiency
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-300">▸</span>
                  <span>Implement proactive maintenance in hotspot areas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffView;
