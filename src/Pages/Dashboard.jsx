import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Folder,
  BookOpen,
  Wallet,
  PieChart,
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart as RePieChart,
  Cell,
} from "recharts";
import Sidebar from "../Components/Sidebar/Sidebar";
import AdminHeader from "../Components/Dashboard/DashboardHeader";
import { useInstructorContext } from '../Components/Context/InstructorContext';
import { useCategoryContext } from '../Components/Context/CategoryContext';

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-48 bg-gray-200 rounded"></div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { fetchInstructorCount } = useInstructorContext();
  const { fetchCategoryCount } = useCategoryContext();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [walletData, setWalletData] = useState({
    balance: 0,
    percentChange: 0,
    monthlyData: []
  });
  const [pieData, setPieData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [instructorCount, categoryCount] = await Promise.all([
          fetchInstructorCount(),
          fetchCategoryCount(),
        ]);

        const courseResponse = await fetch('/api/Courses/GetAll?pageNumber=1&pageSize=1000');
        if (!courseResponse.ok) throw new Error('Failed to fetch courses');
        const courseData = await courseResponse.json();
        const courseCount = courseData.data ? courseData.data.length : 0;

        const mappedStats = [
          {
            label: "Instructors",
            value: instructorCount,
            icon: <Users size={22} />,
            color: "text-blue-500",
            trend: 0
          },
          {
            label: "Categories",
            value: categoryCount,
            icon: <Folder size={22} />,
            color: "text-blue-500",
            trend: 0
          },
          {
            label: "Courses",
            value: courseCount,
            icon: <BookOpen size={22} />,
            color: "text-blue-500",
            trend: 0
          },
        ];
        setStats(mappedStats);

        const mockBalance = courseCount * 149;
        const mockMonthlyData = [
          { month: "Sep", deposits: mockBalance * 0.15, withdrawals: mockBalance * 0.08 },
          { month: "Oct", deposits: mockBalance * 0.18, withdrawals: mockBalance * 0.09 },
          { month: "Nov", deposits: mockBalance * 0.22, withdrawals: mockBalance * 0.10 },
          { month: "Dec", deposits: mockBalance * 0.20, withdrawals: mockBalance * 0.11 },
          { month: "Jan", deposits: mockBalance * 0.25, withdrawals: mockBalance * 0.12 },
        ];

        setWalletData({
          balance: mockBalance,
          percentChange: 2.45,
          monthlyData: mockMonthlyData
        });

        const total = instructorCount + categoryCount + courseCount;
        const mappedPieData = [
          {
            name: "Instructors",
            value: total > 0 ? Math.round((instructorCount / total) * 100) : 33.3,
            color: "#4318FF",
            count: instructorCount
          },
          {
            name: "Categories",
            value: total > 0 ? Math.round((categoryCount / total) * 100) : 33.3,
            color: "#6AD2FF",
            count: categoryCount
          },
          {
            name: "Courses",
            value: total > 0 ? Math.round((courseCount / total) * 100) : 33.4,
            color: "#bbc9deff",
            count: courseCount
          },
        ];
        setPieData(mappedPieData);

        setLastRefresh(new Date());

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');

        setStats([
          { label: "Instructors", value: 0, icon: <Users size={22} />, color: "text-blue-500" },
          { label: "Categories", value: 0, icon: <Folder size={22} />, color: "text-purple-500" },
          { label: "Courses", value: 0, icon: <BookOpen size={22} />, color: "text-green-500" },
        ]);
        setWalletData({ balance: 0, percentChange: 0, monthlyData: [] });
        setPieData([
          { name: "Instructors", value: 33.3, color: "#3b82f6" },
          { name: "Categories", value: 33.3, color: "#3b82f6" },
          { name: "Courses", value: 33.4, color: "#3b82f6" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchInstructorCount, fetchCategoryCount]);

  const formatCurrency = (amount) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    const formatted = Math.abs(value).toFixed(2);
    return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-64">
        <AdminHeader
          title="Dashboard"
          subtitle="Overview"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}

        />

        <div className="p-6 space-y-6">
          {error && !isLoading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
              <button onClick={handleRefresh} className="mt-2 text-sm underline">
                Try Again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              stats.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow p-6 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    if (item.label === "Instructors") navigate('/dashboard/instructors');

                    else if (item.label === "Courses") navigate('/dashboard/courses');
                  }}
                >
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{item.value}</h2>
                    <p className="text-gray-500">{item.label}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 ${item.color}`}>
                    {item.icon}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Wallet className="text-blue-500" size={20} /> Wallet
                  </h2>
                  <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                    <Calendar size={16} />
                    This month
                  </span>
                </div>

                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(walletData.balance)}
                </p>
                <p className={`text-sm font-medium mb-4 ${walletData.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(walletData.percentChange)} Total course value
                </p>

                {walletData.monthlyData.length > 0 && (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={walletData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="deposits" stroke="#3b82f6" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="withdrawals" stroke="#06b6d4" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}

            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <PieChart className="text-purple-500" size={20} /> Statistics
                </h2>

                {pieData.length > 0 && (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <RePieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ value }) => `${value}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </RePieChart>
                    </ResponsiveContainer>

                    <div className="flex justify-around mt-4 text-sm">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <span className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: item.color }} />
                          <p className="text-gray-600">{item.name}</p>
                          <p className="font-semibold text-gray-900">{item.value}%</p>
                          <p className="text-xs text-gray-500">({item.count})</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}