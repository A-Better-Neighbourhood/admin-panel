"use client";

import { FileText, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { issuesAPI, Issue } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, reports] = await Promise.all([
        issuesAPI.getIssueStats(),
        issuesAPI.getAllIssues(),
      ]);

      setStats(statsData);
      // Get the 5 most recent reports
      setRecentReports(reports.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          name: "Total Reports",
          value: stats.total.toString(),
          icon: FileText,
          href: "/dashboard/reports",
          color: "blue",
        },
        {
          name: "Pending",
          value: stats.pending.toString(),
          icon: AlertCircle,
          href: "/dashboard/reports?status=PENDING",
          color: "yellow",
        },
        {
          name: "In Progress",
          value: stats.inProgress.toString(),
          icon: TrendingUp,
          href: "/dashboard/reports?status=IN_PROGRESS",
          color: "blue",
        },
        {
          name: "Resolved",
          value: stats.resolved.toString(),
          icon: CheckCircle,
          href: "/dashboard/resolved",
          color: "green",
        },
      ]
    : [];

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
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-sm border p-6">
                <Skeleton className="h-20 w-full" />
              </div>
            ))
          : statCards.map((stat) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: "bg-primary/10 text-primary",
                yellow:
                  "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
                green:
                  "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
              };
              return (
                <Link
                  key={stat.name}
                  href={stat.href}
                  className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.name}
                      </p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        colorClasses[stat.color as keyof typeof colorClasses]
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Recent Reports */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))
          ) : recentReports.length > 0 ? (
            recentReports.map((report) => {
              const getStatusBadge = (status: string) => {
                const styles = {
                  PENDING:
                    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400",
                  IN_PROGRESS:
                    "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400",
                  RESOLVED:
                    "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400",
                  ARCHIVED: "bg-muted text-muted-foreground",
                };
                return styles[status as keyof typeof styles] || styles.PENDING;
              };

              return (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {report.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadge(
                      report.status
                    )}`}
                  >
                    {report.status.replace("_", " ")}
                  </span>
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No reports yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
