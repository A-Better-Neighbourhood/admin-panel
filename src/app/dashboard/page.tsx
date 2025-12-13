/** @format */

"use client";

import {
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { issuesAPI, Issue } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of community reports.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: "bg-primary/10 text-primary",
                yellow: "bg-secondary text-secondary-foreground",
                green: "bg-primary/20 text-primary",
              };
              return (
                <Card
                  key={stat.name}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="flex items-center justify-between">
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
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Recent Reports */}
      <h1 className="text-2xl font-semibold mb-3">Recent Reports</h1>
      <div>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : recentReports.length > 0 ? (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((report) => {
                  const getStatusStyles = (status: string) => {
                    const styles = {
                      PENDING:
                        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                      IN_PROGRESS:
                        "bg-primary/10 text-primary hover:bg-primary/20",
                      RESOLVED:
                        "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400",
                      ARCHIVED:
                        "bg-muted text-muted-foreground hover:bg-muted/80",
                    };
                    return (
                      styles[status as keyof typeof styles] || styles.PENDING
                    );
                  };

                  return (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <Link
                            href={`/dashboard/reports/${report.id}`}
                            className="hover:underline truncate max-w-[200px] md:max-w-xs block"
                          >
                            {report.title}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${getStatusStyles(
                            report.status
                          )}`}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8"
                        >
                          <Link href={`/dashboard/reports/${report.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No reports yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
}
