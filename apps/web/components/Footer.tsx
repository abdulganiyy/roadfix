import {
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
       <footer className="border-t border-border mt-20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-2 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="font-bold">RoadFix</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Making communities safer, one report at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground transition">
                    FAQS
                  </a>
                </li>
              </ul>
            </div>
            {/* <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2026 RoadFix. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export {Footer}