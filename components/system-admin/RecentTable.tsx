"use client"

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"

interface RecentTableProps {
  columns: { header: string; accessor: string }[]
  data: any[]
}

export function RecentTable({ columns, data }: RecentTableProps) {
  // Helper function to get nested object values
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj)
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  isHeader
                  key={col.header}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent">
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                {columns.map((col) => (
                  <TableCell key={col.header} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {getNestedValue(row, col.accessor)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
