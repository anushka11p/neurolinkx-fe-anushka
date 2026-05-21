'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { useState } from 'react';

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  emptyMessage?: string;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-[var(--color-bg-tertiary)] rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  );
}

export default function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data found.',
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    initialState: { pagination: { pageSize: 10 } },
  });

  const allColumns = table.getAllLeafColumns().filter((c) => c.id !== 'select');

  return (
    <div className="flex flex-col gap-3">
      {/* Column Visibility Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] font-medium">
          Columns:
        </span>
        {allColumns.map((col) => (
          <label
            key={col.id}
            className="flex items-center gap-1 text-[var(--font-size-sm)] cursor-pointer"
          >
            <input
              type="checkbox"
              checked={col.getIsVisible()}
              onChange={col.getToggleVisibilityHandler()}
              className="accent-[var(--color-primary)]"
            />
            <span className="text-[var(--color-text-primary)] capitalize">{col.id}</span>
          </label>
        ))}
      </div>

      {/* Selected count */}
      {Object.keys(rowSelection).length > 0 && (
        <p className="text-[var(--font-size-sm)] text-[var(--color-primary)]">
          {Object.keys(rowSelection).length} row(s) selected
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <table className="w-full border-collapse text-[var(--font-size-sm)]">
          <thead className="bg-[var(--color-bg-secondary)]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={[
                      'px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]',
                      'border-b border-[var(--color-border)]',
                      header.column.getCanSort()
                        ? 'cursor-pointer select-none hover:text-[var(--color-text-primary)]'
                        : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-xs">
                          {header.column.getIsSorted() === 'asc'
                            ? ' ↑'
                            : header.column.getIsSorted() === 'desc'
                              ? ' ↓'
                              : ' ↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--color-text-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={[
                    'border-b border-[var(--color-border)] transition-colors',
                    'hover:bg-[var(--color-bg-secondary)]',
                    row.getIsSelected() ? 'bg-[var(--color-bg-secondary)]' : '',
                  ].join(' ')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-[var(--color-text-primary)]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 text-[var(--font-size-sm)] rounded-[var(--radius-md)] border border-[var(--color-border)] disabled:opacity-50 hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 text-[var(--font-size-sm)] rounded-[var(--radius-md)] border border-[var(--color-border)] disabled:opacity-50 hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
