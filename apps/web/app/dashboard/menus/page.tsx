"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CreateItem from "@/components/CreateItem";
import Item from "@/components/Item";
import EditItem from "@/components/EditItem";
import DeleteItem from "@/components/DeleteItem";
import axios from "axios";
import { Menu } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const columns: ColumnDef<Menu>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subTitle",
    header: "SubTitle",
    cell: ({ row }) => {
      return (
        <div className="w-50 overflow-hidden">{row.getValue("subTitle")}</div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="w-50 overflow-hidden">
          {row.getValue("description")}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format((row.getValue("price") as number) / 100);
    },
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (row.getValue("category") as any).name;
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Item menu={row.original} />
          <EditItem menu={row.original} />
          <DeleteItem menu={row.original} />
        </div>
      );
    },
  },
];

const MenusPage = () => {
  const { data: menus } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await axios.get("/api/menu");

      return res.data;
    },
  });

  const table = useReactTable({
    data: menus ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border bg-white">
        <div className="flex justify-between items-center px-2 pt-4">
          <h2 className="font-bold">Menus</h2>
          <CreateItem />
        </div>
        <div className="table-container">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center space-x-2 py-4 px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenusPage;
