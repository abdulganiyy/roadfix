import { Button } from "@/components/ui/button";
import {
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

const MainNavbar = () => {
    const router = useRouter()

  return (
       <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold">RoadFix</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Features
            </a>
            {/* <a
              href="#impact"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Impact
            </a> */}
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition"
            >
              How It Works
            </a>
          </div>
          <Button onClick={()=>{
                router.push("/register")
              }} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Get Started
          </Button>
        </div>
      </nav>
  )
}

export { MainNavbar }