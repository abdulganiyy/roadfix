"use client";
import { useState } from "react";
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
import { MainNavbar } from "@/components/MainNavbar";
import { Footer } from "@/components/Footer";
import { uploadImage } from "@/services";
import Image from "next/image";

const formSchema = z.object({
  title: z.string(),
  problemType: z.string(),
  severity: z.string(),
  description: z.string().optional(),
  email: z.string().optional(),
  photo: z.string(),
});

export default function ReportPage() {
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      problemType: "",
      severity: "",
      description: "",
      email: "",
      photo: "",
    },
  });

  const { latitude, longitude, accuracy, status, error, requestLocation } =
    useGeolocation();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/report", data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Report submitted successfully");
      form.reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(JSON.stringify(values));
    mutation.mutate({ ...values, longitude, latitude, gpsAccuracy: accuracy });
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement | null>,
  ) => {
    const file = e.target.files?.[0];
    setIsUploading(true);

    try {
      const { secure_url } = await uploadImage(file);

      form.setValue("photo", secure_url);
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainNavbar />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
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
                className="mb-8 w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 font-semibold"
              >
                Start Location Verification
              </Button>
            )}

            {status === "checking-permission" && (
              <div className="mb-8 p-6 bg-accent/10 border border-accent/30 rounded-xl flex gap-4 items-start animate-in fade-in duration-300">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    Checking permissions...
                  </p>
                </div>
              </div>
            )}
            {status === "requesting" && (
              <div className="mb-8 p-6 bg-accent/10 border border-accent/30 rounded-xl flex gap-4 items-start animate-in fade-in duration-300">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Detecting location...</p>
                </div>
              </div>
            )}

            {status === "granted" && (
              <div className="mb-8 p-6 bg-accent/10 border border-accent/30 rounded-xl flex gap-4 items-start animate-in fade-in duration-300">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <p>Latitude: {latitude}</p>
                  <p>Longitude: {longitude}</p>
                  <p>Accuracy: {accuracy?.toFixed(2)} meters</p>
                </div>
              </div>
            )}

            {status === "denied" && (
              <div className="mb-8 p-6 bg-red-100 border border-red-500 rounded-xl flex gap-4 items-start animate-in fade-in duration-300">
                <CheckCircle2 className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mb-8 p-6 bg-orange-100 border border-orange-500 rounded-xl flex gap-4 items-start animate-in fade-in duration-300">
                <CheckCircle2 className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-600">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* {submitted && (
            <div className="mb-8 p-6 bg-accent/10 border border-accent/30 rounded-xl flex gap-4 items-start animate-in fade-in duration-300">
              <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Report Submitted Successfully!</h3>
                <p className="text-muted-foreground">Thank you for helping make roads safer. Our team will review your report shortly.</p>
              </div>
            </div>
          )} */}

          {status === "granted" && (
            <Card className="bg-card border-border p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter title for the problem you are reporting"
                            {...field}
                            className="border-border bg-background text-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Issue Type */}
                  <FormField
                    control={form.control}
                    name="problemType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
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
                              <SelectItem value="POTHOLE">Pothole</SelectItem>
                              <SelectItem value="FLOODING">
                                Flooding/Water Damage
                              </SelectItem>
                              <SelectItem value="BLOCKED_DRAINAGE">
                                Blocked Drainage
                              </SelectItem>
                              <SelectItem value="TRAFFIC_LIGHT">
                                Damaged Traffic Sign or Marking
                              </SelectItem>
                              <SelectItem value="OTHER">
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
                              <SelectItem value="MINOR">
                                Minor (Cosmetic)
                              </SelectItem>
                              <SelectItem value="MODERATE">
                                Moderate (Risky)
                              </SelectItem>
                              <SelectItem value="SEVERE">
                                Severe (Hazardous)
                              </SelectItem>
                              <SelectItem value="CRITICAL">
                                Critical (Dangerous)
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                              disabled={isUploading}
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="photo"
                              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 hover:bg-card/50 transition"
                            >
                              <Upload className="w-8 h-8 text-accent" />
                              <div className="text-center">
                                <p className="font-semibold truncate w-64">
                                  {field.value
                                    ? field.value
                                    : "Click to upload a photo from camera"}
                                </p>
                              </div>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                        {isUploading && <div>Uploading image...</div>}
                        {form.getValues("photo") && (
                          <Image
                            alt="location-image"
                            src={form.getValues("photo")}
                            height={200}
                            width={200}
                          />
                        )}
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
                            <p className="text-sm text-muted-foreground mt-4">
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
                  {/* <div className="p-4 bg-card/50 border border-border rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      All reports are reviewed by our team and shared with local
                      authorities. Your report helps us prioritize road
                      maintenance and keep communities safe.
                    </p>
                  </div> */}

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

      <Footer />
    </div>
  );
}
