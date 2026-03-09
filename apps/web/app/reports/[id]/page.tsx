"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, ThumbsUp, ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Report } from "@/types";
import { STATUS_CONFIG, SEVERITY_CONFIG } from "@/constants";
import { fetchReport } from "@/services";
import { useParams } from "next/navigation";

export default function SingleReportPage() {
  const params = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => fetchReport(params.id as string),
  });

  const report: Report = data;
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(report?.upvotes || 0);

  const handleUpvote = () => {
    setHasUpvoted(!hasUpvoted);
    setUpvoteCount((prev) => (hasUpvoted ? prev - 1 : prev + 1));
  };

  if (!report) return;

  const statusConfig =
    STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold">RoadFix</span>
          </a>
          <a href="/reports" className="inline-block">
            <Button
              variant="outline"
              className="border-border hover:bg-card flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Reports
            </Button>
          </a>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {report?.images && (
            <div className="mb-8 rounded-xl overflow-hidden border border-border">
              <img
                src={report.images[0].url}
                alt={report.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                  {report.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color} flex items-center gap-2`}
                  >
                    <statusConfig.icon className="w-4 h-4" />
                    {statusConfig.label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                    {
                      SEVERITY_CONFIG[
                        report.severity as keyof typeof SEVERITY_CONFIG
                      ].label
                    }
                    {` `}
                    Severity
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                    {report.problemType}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{report.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Intl.DateTimeFormat().format(new Date(report.createdAt))}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  by {report.submittedBy ? report.submittedBy : "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{report.views || 0} views</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Button
              onClick={handleUpvote}
              className={`flex items-center gap-2 ${
                hasUpvoted
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-card border text-white border-border hover:bg-muted"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              Upvote ({upvoteCount})
            </Button>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {report.description && (
                <Card className="bg-card border-border p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4">Report Details</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {report.description}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
