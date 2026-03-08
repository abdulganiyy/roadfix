"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { MainNavbar } from "@/components/MainNavbar";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <MainNavbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              Report Road Problems That Matter
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Help keep your community safe by reporting potholes, hazards, and
              infrastructure damage. See real-time updates as issues get
              resolved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => {
                  router.push("/add-report");
                }}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6"
              >
                Report Now
              </Button>
              <Button
                onClick={() => {
                  router.push("/reports");
                }}
                variant="outline"
                className="border-border hover:bg-card hover:text-card-foreground text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 space-y-4">
                <div className="w-full h-48 bg-linear-to-br from-accent/30 to-accent/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-accent mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      Interactive Road Map
                    </p>
                  </div>
                </div>
                {/* <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background p-3 rounded-lg border border-border/50">
                    <AlertCircle className="w-5 h-5 text-accent mb-2" />
                    <p className="text-sm font-semibold">847 Reports</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg border border-border/50">
                    <TrendingUp className="w-5 h-5 text-accent mb-2" />
                    <p className="text-sm font-semibold">89% Resolved</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Powerful Reporting Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make a real difference in your community
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Instant Reporting",
              description:
                "Report issues in seconds with photos, location, and details. Get instant confirmation of submission.",
            },
            {
              icon: Shield,
              title: "Track Resolution",
              description:
                "Monitor progress as municipalities review and fix reported issues. See real-time status updates.",
            },
            {
              icon: Users,
              title: "Community Powered",
              description:
                "Join thousands of citizens making roads safer. Vote on issues and build civic awareness.",
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="bg-card border-border p-6 hover:border-accent/50 transition"
            >
              <feature.icon className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      {/* <section
        id="impact"
        className="container mx-auto px-4 py-20 bg-card/30 my-20 rounded-2xl"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Real Impact in Communities
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { stat: "25K+", label: "Reports Submitted" },
            { stat: "92%", label: "Average Resolution Rate" },
            { stat: "1.2M", label: "Lives Affected" },
            { stat: "340", label: "Active Cities" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {item.stat}
              </p>
              <p className="text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-balance text-center">
          Three Simple Steps
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              number: "01",
              title: "Spot an Issue",
              description:
                "See a pothole or road hazard? Open RoadWatch and tap the report button.",
            },
            {
              number: "02",
              title: "Add Details",
              description:
                "Take a photo, describe the problem, and let us pinpoint it on the map.",
            },
            {
              number: "03",
              title: "Track Progress",
              description:
                "Watch as your report reaches authorities and gets resolved in real time.",
            },
          ].map((step, i) => (
            <div key={i} className="relative">
              <div className="flex flex-col gap-4">
                <div className="text-6xl font-bold text-accent/20">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-linear-to-r from-accent/50 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="container mx-auto px-4 py-20">
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Start Making Roads Safer Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of thousands working together to improve
            infrastructure and keep everyone safe.
          </p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
            Download RoadFix
          </Button>
        </div>
      </section> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}
