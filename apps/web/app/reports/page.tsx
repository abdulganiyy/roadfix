"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, ChevronRight, Filter, MapIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "@/services";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import Link from "next/link";
import { Report } from "@/types";
import { STATUS_CONFIG, SEVERITY_CONFIG, types, statuses } from "@/constants";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState("");
  const [lng, setLng] = useState<number | undefined>(0);
  const [lat, setLat] = useState<number | undefined>(0);
  const [problemType, setProblemType] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    if (!searchQuery) {
      setLat(undefined);
      setLng(undefined);
    }
  }, [searchQuery]);

  const onPlaceSelected = (feature: any) => {
    setSearchQuery(feature?.properties?.formatted);
    setLng(feature?.geometry.coordinates[0]);
    setLat(feature?.geometry.coordinates[1]);
  };

  const params = {
    page,
    limit: 10,
    severity,
    problemType,
    sort,
    order,
    lng,
    lat,
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["reports", params],
    queryFn: () => fetchReports(params),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading reports...
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center gap-3 text-red-500 h-64 justify-center">
        <p>Failed to load reports</p>
        <p>{error?.message}</p>

        <button onClick={() => refetch()}>Retry</button>
      </div>
    );

  const reports = data?.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold">RoadFix</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/add-report" className="hidden sm:inline-block">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Report Issue
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Community Road Reports
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Track ongoing road repairs and contribute to keeping your community
            safe
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}

          <GeoapifyContext
            apiKey={`${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`}
          >
            <GeoapifyGeocoderAutocomplete
              placeholder="Enter address here"
              value={searchQuery}
              lang="en"
              limit={8}
              debounceDelay={1000}
              addDetails={true}
              placeSelect={onPlaceSelected}
            />
          </GeoapifyContext>

          {/* Filter and Sort Controls */}
          <div className="grid md:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Issue Type
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setProblemType("")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    problemType === null
                      ? "bg-accent text-accent-foreground"
                      : "bg-card hover:bg-card/80 text-foreground"
                  }`}
                >
                  All Types
                </button>
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setProblemType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      problemType === type
                        ? "bg-accent text-accent-foreground"
                        : "bg-card hover:bg-card/80 text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Status
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setFilterStatus(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    filterStatus === null
                      ? "bg-accent text-accent-foreground"
                      : "bg-card hover:bg-card/80 text-foreground"
                  }`}
                >
                  All Status
                </button>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      filterStatus === status
                        ? "bg-accent text-accent-foreground"
                        : "bg-card hover:bg-card/80 text-foreground"
                    }`}
                  >
                    {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Sort By
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSort("createdAt")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    sort === "recent"
                      ? "bg-accent text-accent-foreground"
                      : "bg-card hover:bg-card/80 text-foreground"
                  }`}
                >
                  Most Recent
                </button>
                <button
                  onClick={() => setSort("upvotes")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    sort === "upvotes"
                      ? "bg-accent text-accent-foreground"
                      : "bg-card hover:bg-card/80 text-foreground"
                  }`}
                >
                  Most Upvoted
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Summary
              </label>
              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Reports:</span>
                  <span className="font-semibold">{reports?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Resolved:</span>
                  <span className="font-semibold text-green-400">
                    {reports.filter((r: Report) => r.status === "FIXED").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card className="border-border">
              <div className="p-12 text-center">
                <MapIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            </Card>
          ) : (
            reports.map((report: Report) => {
              const statusConfig = STATUS_CONFIG[report.status];
              const severityConfig = SEVERITY_CONFIG[report.severity];
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={report.id}
                  className={`border-l-4 ${severityConfig.color} hover:bg-card/80 transition cursor-pointer group`}
                >
                  <Link href={`/reports/${report.id}`}>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold group-hover:text-accent transition">
                                {report.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-background px-2 py-1 rounded border border-border/50">
                                  {report.problemType}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${statusConfig.color}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {statusConfig.label}
                                </span>
                                <span className="text-xs bg-background px-2 py-1 rounded border border-border/50">
                                  {SEVERITY_CONFIG[report.severity].label}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{report.address}</span>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {report.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {new Intl.DateTimeFormat().format(
                                new Date(report.createdAt),
                              )}
                            </span>
                            <span>👍 {report.upvotes || 0} supports</span>
                          </div>
                        </div>

                        {report.images && (
                          <div className="hidden sm:block">
                            <img
                              src={report.images[0].url}
                              alt={report.title}
                              className="w-24 h-24 rounded-lg object-cover border border-border"
                            />
                          </div>
                        )}

                        <div className="flex items-center">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
