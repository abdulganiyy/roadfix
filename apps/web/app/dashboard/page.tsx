"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomersChart } from "@/components/CustomersChart";
import { OrdersChart } from "@/components/OrdersChart";
import RecentOrders from "@/components/RecentOrders";
import axios from "axios";
import { Order } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axios.get("/api/stats");

      return res.data;
    },
  });

  console.log(data);

  if (isLoading) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 py-8 bg-white border-l-8 rounded-md space-y-4">
          <div className="text-gray-500">Orders</div>
          <div className="text-gray-700 font-bold text-3xl">
            {data?.totalOrders ?? 0}
          </div>
        </div>
        <div className="p-4 py-8 bg-white border-l-8 rounded-md space-y-4">
          <div className="text-gray-500">Customers</div>
          <div className="text-gray-700 font-bold text-3xl">
            {data?.totalCustomers ?? 0}
          </div>
        </div>
        <div className="p-4 py-8 bg-white border-l-8 rounded-md space-y-4">
          <div className="text-gray-500">Menus</div>
          <div className="text-gray-700 font-bold text-3xl">
            {data?.totalMenus ?? 0}
          </div>
        </div>
        <div className="p-4 py-8 bg-white border-l-8 rounded-md space-y-4">
          <div className="text-gray-500">Total Revenue</div>
          <div className="text-gray-700 font-bold text-3xl">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(data?.totalRevenue / 100)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomersChart
          data={data.customersPerDay.map(({ date, count }: any) => ({
            date,
            customer: count,
          }))}
        />
        <OrdersChart
          data={data.ordersPerDay.map(({ date, count }: any) => ({
            date,
            order: count,
          }))}
        />
      </div>
      <RecentOrders orders={data.recentOrders as Order[]} />
    </div>
  );
}
