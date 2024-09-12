"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { SortAscIcon } from "lucide-react";
import { TeamMembersDialog } from "~/components/ui/custom/view-team-members";

export const columnsForSolo: ColumnDef<any>[] = [
  {
    accessorFn: (row) => row.Members?.[0]?.id ?? "N/A",
    id: "userId",
    header: "User ID",
  },
  {
    accessorFn: (row) => row.Members?.[0]?.name ?? "N/A",
    id: "userName", 
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white"
      >
        User Name
        <SortAscIcon className="ml-2 h-4 w-4 text-white" />
      </button>
    ),
  },
  {
    accessorKey: "hasAttended",
    id: "attendance",
    header: "Attendance",
    cell: ({ getValue }) => (
      <input
        type="checkbox"
        checked={getValue()}
        onChange={(e) => markAttendance(e.target.checked)}
      />
    ),
  },
];
export const columnsForTeam: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Team ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white"
      >
        Team Name
        <SortAscIcon className="ml-2 h-4 w-4 text-white" />
      </button>
    ),
  },
  {
    accessorKey: "isConfirmed",
    header: "Confirmed",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  },
  {
    id: "viewMembers",
    cell: ({ row }) => {
      const team = row.original.Members; 
      return (
        <TeamMembersDialog team={team} />
      );
    },
  },
];
const markAttendance = (isChecked: boolean) => {
  console.log(`Marking attendance: ${isChecked}`);
};

const viewTeamMembers = (teamId: string) => {
  console.log(`Viewing members for team: ${teamId}`);
};

const Registrations = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug;
  const { data: event, isLoading, error } = api.event.getEventById.useQuery({ eventId: parseInt(id!) });
  console.log("Event:  ", event)
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const isTeamEvent = event?.maxTeamSize && event.maxTeamSize > 1;
  
  const columns = isTeamEvent ? columnsForTeam : columnsForSolo;

  const table = useReactTable({
    data: event?.Team ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full text-white p-10">
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${isTeamEvent ? "team names" : "user names"}...`}
          value={(table.getColumn(isTeamEvent ? "name" : "userName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(isTeamEvent ? "name" : "userName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-white"
        />
      </div>
      <div className="rounded-md border border-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder ? null : (
                      header.column.columnDef.header
                        ? flexRender(header.column.columnDef.header, header.getContext())
                        : null
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="text-white">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white">
                      {cell.column.columnDef.cell
                        ? flexRender(cell.column.columnDef.cell, cell.getContext())
                        : "No content"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-white">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Registrations;
