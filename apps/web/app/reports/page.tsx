'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MapPin, AlertCircle, CheckCircle, Clock, ChevronRight, Search, Filter, MapIcon } from 'lucide-react'

interface Report {
  id: string
  title: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'in-progress' | 'resolved'
  location: string
  date: string
  description: string
  upvotes: number
  image?: string
}

const SAMPLE_REPORTS: Report[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    type: 'Pothole',
    severity: 'high',
    status: 'in-progress',
    location: '245 Main Street, Downtown',
    date: '2 hours ago',
    description: 'Deep pothole causing safety hazard for cyclists and pedestrians',
    upvotes: 24,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Cracked pavement - Elm Avenue',
    type: 'Pavement Damage',
    severity: 'medium',
    status: 'reported',
    location: '412 Elm Avenue, Northeast District',
    date: '4 hours ago',
    description: 'Multiple cracks forming a pattern, risk of expansion',
    upvotes: 18,
    image: 'https://images.unsplash.com/photo-1581092162562-40038f73dfa1?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Missing manhole cover',
    type: 'Hazard',
    severity: 'critical',
    status: 'in-progress',
    location: '89 Park Road, Central Hub',
    date: '6 hours ago',
    description: 'Open manhole creating serious safety risk. Immediate attention required.',
    upvotes: 42,
    image: 'https://images.unsplash.com/photo-1581092918187-e02e40f78cc2?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'Broken street light pole',
    type: 'Street Lighting',
    severity: 'medium',
    status: 'resolved',
    location: '567 Oak Street, West End',
    date: '1 day ago',
    description: 'Pole leaning at unsafe angle, light no longer functional',
    upvotes: 15,
  },
  {
    id: '5',
    title: 'Flooding during rain',
    type: 'Drainage Issue',
    severity: 'high',
    status: 'reported',
    location: '234 River Lane, Lowland Area',
    date: '8 hours ago',
    description: 'Standing water accumulates rapidly, poses traffic hazard',
    upvotes: 31,
  },
  {
    id: '6',
    title: 'Damaged storm drain cover',
    type: 'Storm Drain',
    severity: 'low',
    status: 'resolved',
    location: '123 Pine Street, South District',
    date: '3 days ago',
    description: 'Cover cracked but functional, recommend replacement',
    upvotes: 8,
  },
]

const STATUS_CONFIG = {
  reported: { label: 'Reported', color: 'bg-blue-500/20 text-blue-400', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
}

const SEVERITY_CONFIG = {
  low: { label: 'Low', color: 'border-blue-500/30' },
  medium: { label: 'Medium', color: 'border-yellow-500/30' },
  high: { label: 'High', color: 'border-orange-500/30' },
  critical: { label: 'Critical', color: 'border-red-500/30' },
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'upvotes'>('recent')

  const filteredAndSortedReports = useMemo(() => {
    let filtered = SAMPLE_REPORTS

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      )
    }

    if (filterType) {
      filtered = filtered.filter(r => r.type === filterType)
    }

    if (filterStatus) {
      filtered = filtered.filter(r => r.status === filterStatus)
    }

    if (sortBy === 'upvotes') {
      filtered.sort((a, b) => b.upvotes - a.upvotes)
    }

    return filtered
  }, [searchQuery, filterType, filterStatus, sortBy])

  const types = Array.from(new Set(SAMPLE_REPORTS.map(r => r.type)))
  const statuses = ['reported', 'in-progress', 'resolved']

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold">RoadWatch</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/report" className="hidden sm:inline-block">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Report Issue</Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Community Road Reports</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Track ongoing road repairs and contribute to keeping your community safe
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, location, or description..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

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
                  onClick={() => setFilterType(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    filterType === null
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card hover:bg-card/80 text-foreground'
                  }`}
                >
                  All Types
                </button>
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      filterType === type
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card hover:bg-card/80 text-foreground'
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
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card hover:bg-card/80 text-foreground'
                  }`}
                >
                  All Status
                </button>
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      filterStatus === status
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card hover:bg-card/80 text-foreground'
                    }`}
                  >
                    {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Sort By</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    sortBy === 'recent'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card hover:bg-card/80 text-foreground'
                  }`}
                >
                  Most Recent
                </button>
                <button
                  onClick={() => setSortBy('upvotes')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    sortBy === 'upvotes'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card hover:bg-card/80 text-foreground'
                  }`}
                >
                  Most Upvoted
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Summary</label>
              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Reports:</span>
                  <span className="font-semibold">{filteredAndSortedReports.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Resolved:</span>
                  <span className="font-semibold text-green-400">
                    {filteredAndSortedReports.filter(r => r.status === 'resolved').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="space-y-4">
          {filteredAndSortedReports.length === 0 ? (
            <Card className="border-border">
              <div className="p-12 text-center">
                <MapIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </Card>
          ) : (
            filteredAndSortedReports.map(report => {
              const statusConfig = STATUS_CONFIG[report.status]
              const severityConfig = SEVERITY_CONFIG[report.severity]
              const StatusIcon = statusConfig.icon

              return (
                <Card
                  key={report.id}
                  className={`border-l-4 ${severityConfig.color} hover:bg-card/80 transition cursor-pointer group`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold group-hover:text-accent transition">{report.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-background px-2 py-1 rounded border border-border/50">
                                {report.type}
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
                          <span className="text-sm">{report.location}</span>
                        </div>

                        <p className="text-muted-foreground text-sm line-clamp-2">{report.description}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{report.date}</span>
                          <span>👍 {report.upvotes} supports</span>
                        </div>
                      </div>

                      {report.image && (
                        <div className="hidden sm:block">
                          <img
                            src={report.image}
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
                </Card>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
