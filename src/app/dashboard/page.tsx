"use client";

import { FileText, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    {
      name: "Total Reports",
      value: "248",
      change: "+12%",
      changeType: "increase",
      icon: FileText,
      href: "/dashboard/reports",
    },
    {
      name: "Pending",
      value: "45",
      change: "+8%",
      changeType: "increase",
      icon: AlertCircle,
      href: "/dashboard/reports?status=PENDING",
    },
    {
      name: "In Progress",
      value: "32",
      change: "+5%",
      changeType: "increase",
      icon: TrendingUp,
      href: "/dashboard/reports?status=IN_PROGRESS",
    },
    {
      name: "Resolved",
      value: "171",
      change: "+18%",
      changeType: "increase",
      icon: CheckCircle,
      href: "/dashboard/resolved",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of community reports.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  from last month
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New report submitted: "Pothole on Main Street"
                </p>
                <p className="text-xs text-gray-600 mt-1">2 hours ago</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
