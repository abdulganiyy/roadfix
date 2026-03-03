"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

import { Eye } from "lucide-react";

const Order = ({ order }: { order: any }) => {
  console.log(order);
  return (
    <Sheet>
      <SheetTrigger>
        <Eye />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{order.orderNumber}</SheetTitle>

          <SheetDescription>Status: {order.status}</SheetDescription>
          <SheetDescription>
            Time:{" "}
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "long",
              timeStyle: "short",
            }).format(new Date(order.createdAt))}
          </SheetDescription>

          <SheetDescription>
            Payment Status: {order.paymentStatus}
          </SheetDescription>
          <SheetDescription>Customer: {order.customerName}</SheetDescription>
          <SheetDescription>Phone: {order.customerPhone}</SheetDescription>
          <SheetDescription>Phone: {order.customerPhone}</SheetDescription>
          <SheetDescription>
            Total:{" "}
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(order.total / 100)}
          </SheetDescription>

          <div>
            Items:{` `}
            {order.items.map((item: any) => {
              return (
                <div className="mb-1 space-x-1">
                  <span>{item.menuTitle}:</span>
                  <span>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(item.unitPrice / 100)}
                  </span>
                </div>
              );
            })}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Order;
