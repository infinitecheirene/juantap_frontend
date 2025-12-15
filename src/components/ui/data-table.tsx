"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, Minus } from "lucide-react"
import { Payment } from "@/app/admin/payments/columns"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  refreshData?: () => void
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  refreshData,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({
    payment_method: false,
    userEmail: false,
    userContact: false,
    submitted_at: false,
})
  const [rowSelection, setRowSelection] = useState({})
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const table = useReactTable({
  data,
  columns,
  state: {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
  },
  enableRowSelection: true,
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onColumnVisibilityChange: setColumnVisibility,
  onRowSelectionChange: setRowSelection,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),

  // ✅ provide meta for refresh
  meta: {
    refreshData,
  },
})


  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  return (
    <div>
      {/* 🔍 Search box */}
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("userName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("userName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* ⚙️ Column toggle menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 📊 Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                <TableHead /> {/* expand button column */}
              </TableRow>
            ))}
          </TableHeader>
         <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const payment = row.original as Payment
              const isExpanded = expandedRows.includes(payment.id)

              const baseRow = (
                <TableRow
                  key={`row-${row.id}`}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )

              const expandedRow = isExpanded ? (
                <TableRow key={`expanded-${row.id}`} className="bg-gray-50">
                  <TableCell
                    colSpan={row.getVisibleCells().length + 1}
                    className="px-5 py-3 text-sm text-gray-700"
                  >
                    <div className="flex flex-wrap gap-8">
                      <div>
                        <strong>Template Price:</strong> ₱
                        {payment.template?.price?.toLocaleString("en-PH") ?? "-"}
                      </div>
                      <div>
                        <strong>User Email:</strong> {payment.user?.email ?? "-"}
                      </div>
                      <div>
                        <strong>User Contact:</strong>{" "}
                        {payment.user?.profile?.phone ?? "-"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : null

              // ✅ Return array of TableRow elements with keys
              return [baseRow, expandedRow]
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        </Table>
      </div>

      {/* ⏩ Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
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
  )
}
