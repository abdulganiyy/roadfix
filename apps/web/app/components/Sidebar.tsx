"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Menus", href: "/dashboard/menus" },
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Customers", href: "/dashboard/customers" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar({
  closeSidebar,
}: {
  closeSidebar?: () => void;
}) {
  const pathname = usePathname();

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/auth/logout");

      return res.data;
    },
    onSuccess: (data) => {
      console.log(data.message);

      toast.success(data.message);

      router.replace("/");
    },
  });

  return (
    <aside className="w-64 h-full border-r bg-white">
      <div className="p-6 text-xl font-bold text-black">Admin Panel</div>

      <nav className="px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeSidebar}
              className={`block px-4 py-2 rounded-lg transition text-black ${
                isActive ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-96">
        <Button
          onClick={() => {
            mutation.mutate();
          }}
          variant="destructive"
          className="mx-4 space-x-2 cursor-pointer"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </aside>
  );
}
