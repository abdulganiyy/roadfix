import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export const SESSION_COOKIE_NAME = "_nintpay_WH12Lk";

export const STATUS_CONFIG = {
  PENDING: {
    label: "Reported",
    color: "bg-blue-500/20 text-blue-400",
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-yellow-500/20 text-yellow-400",
    icon: Clock,
  },
  FIXED: {
    label: "Fixed",
    color: "bg-green-500/20 text-green-400",
    icon: CheckCircle,
  },
  VERIFIED: {
    label: "Verified",
    color: "bg-brown-500/20 text-brown-400",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-500/20 text-red-400",
    icon: CheckCircle,
  },
};

export const SEVERITY_CONFIG = {
  MINOR: { label: "Low", color: "border-blue-500/30" },
  MODERATE: { label: "Medium", color: "border-yellow-500/30" },
  SEVERE: { label: "High", color: "border-orange-500/30" },
  CRITICAL: { label: "Critical", color: "border-red-500/30" },
};

export const types = [
  "POTHOLE",
  "FLOODING",
  "BROKEN_ROAD",
  "BLOCKED_DRAINAGE",
  "TRAFFIC_LIGHT",
  "OTHER",
];

export const statuses = [
  "PENDING",
  "FIXED",
  "VERIFIED",
  "REJECTED",
  "IN_PROGRESS",
];
