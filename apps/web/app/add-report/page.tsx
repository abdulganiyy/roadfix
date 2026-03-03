"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MapPin, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/user-geolocation";

const formSchema = z.object({
  issueType: z.string(),
  severity: z.string(),
  location: z.string(),
  description: z.string(),
  email: z.string(),
  photo: z.string(),
});

export default function ReportPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      issueType: "",
      severity: "",
      location: "",
      description: "",
      email: "",
      photo: "",
    },
  });

  const { latitude, longitude, accuracy, status, error, requestLocation } =
    useGeolocation();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await axios.post("/api/report", data);

      return res.data;
    },
    onSuccess: () => {
      //   router.replace("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(JSON.stringify(values));
    // mutation.mutate(values);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
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
          <Button variant="outline" className="border-border hover:bg-card">
            Back to Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Report a Road Problem
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us keep your community safe by reporting road hazards and
              infrastructure damage.
            </p>
          </div>

          <div>
            {status === "idle" && (
              <Button
                onClick={requestLocation}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 font-semibold"
              >
                Start Location Verification
              </Button>
            )}

            {status === "checking-permission" && <p>Checking permission...</p>}
            {status === "requesting" && <p>Detecting location...</p>}

            {status === "granted" && (
              <div>
                <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
                <p>Accuracy: {accuracy?.toFixed(2)} meters</p>
              </div>
            )}

            {status === "denied" && <p style={{ color: "red" }}>{error}</p>}

            {status === "error" && <p style={{ color: "orange" }}>{error}</p>}
          </div>

          {/* Success Message */}
          {/* {submitted && (
            <div className="mb-8 p-6 bg-accent/10 border border-accent/30 rounded-xl flex gap-4 items-start animate-in fade-in duration-300">
              <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Report Submitted Successfully!</h3>
                <p className="text-muted-foreground">Thank you for helping make roads safer. Our team will review your report shortly.</p>
              </div>
            </div>
          )} */}

          {/* Form Card */}
          {status === "granted" && (
            <Card className="bg-card border-border p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Issue Type */}
                  <FormField
                    control={form.control}
                    name="issueType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          {" "}
                          What type of issue did you find?
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="border-border bg-background text-foreground h-11">
                              <SelectValue placeholder="Select an issue type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pothole">Pothole</SelectItem>
                              <SelectItem value="crack">
                                Cracked Pavement
                              </SelectItem>
                              <SelectItem value="flooding">
                                Flooding/Water Damage
                              </SelectItem>
                              <SelectItem value="debris">
                                Debris or Obstruction
                              </SelectItem>
                              <SelectItem value="sign">
                                Damaged Sign or Marking
                              </SelectItem>
                              <SelectItem value="other">
                                Other Damage
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Severity Level */}
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          How severe is the damage?
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="border-border bg-background text-foreground h-11">
                              <SelectValue placeholder="Select severity level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minor">
                                Minor (Cosmetic)
                              </SelectItem>
                              <SelectItem value="moderate">
                                Moderate (Risky)
                              </SelectItem>
                              <SelectItem value="severe">
                                Severe (Hazardous)
                              </SelectItem>
                              <SelectItem value="critical">
                                Critical (Dangerous)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          {" "}
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Street name, intersection, or address"
                            {...field}
                            className="border-border bg-background text-foreground h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          {" "}
                          Describe the problem
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide details about the issue (size, location within street, any hazards, etc.)"
                            {...field}
                            className="border-border bg-background text-foreground min-h-32 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Photo Upload */}
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          {" "}
                          Upload a photo
                        </FormLabel>
                        <FormControl>
                          <div>
                            <input
                              id="photo"
                              name="photo"
                              type="file"
                              capture="environment"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="photo"
                              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 hover:bg-card/50 transition"
                            >
                              <Upload className="w-8 h-8 text-accent" />
                              <div className="text-center">
                                <p className="font-semibold">
                                  {field.value
                                    ? field.value
                                    : "Click to upload a photo from camera"}
                                </p>
                                {/* <p className="text-sm text-muted-foreground">or drag and drop</p> */}
                              </div>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          Email (optional)
                        </FormLabel>
                        <FormControl>
                          <div>
                            <Input
                              placeholder="your@email.com"
                              {...field}
                              className="border-border bg-background text-foreground h-11"
                            />
                            <p className="text-sm text-muted-foreground">
                              We'll send you updates when your report is
                              reviewed.
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Info Box */}
                  <div className="p-4 bg-card/50 border border-border rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      All reports are reviewed by our team and shared with local
                      authorities. Your report helps us prioritize road
                      maintenance and keep communities safe.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 font-semibold"
                    disabled={mutation.isPending}
                  >
                    Submit Report
                  </Button>
                </form>
              </Form>
            </Card>
          )}

          {/* Additional Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Real Impact",
                description:
                  "Your reports directly influence road maintenance decisions.",
              },
              {
                title: "Transparent Tracking",
                description:
                  "Monitor your report progress from submission to resolution.",
              },
              {
                title: "Community Driven",
                description:
                  "Join thousands helping make roads safer together.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2026 RoadFix. Helping communities keep roads safe.</p>
        </div>
      </footer>
    </div>
  );
}
