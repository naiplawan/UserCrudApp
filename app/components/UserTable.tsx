'use client';

import { useState, useEffect, Fragment, useMemo } from 'react';
import { User } from '@/app/interface';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<User>();

const FILTERABLE_COLUMNS = [
  'first_name',
  'last_name',
  'email',
  'gender',
  'city',
  'country',
  'country_code',
  'state',
  'street_address',
  'job_title',
  'company_name'
];

export default function UserTable() {
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, boolean>>(
    FILTERABLE_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await fetch('/api/sheets');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0])
      .filter(key => columnFilters[key])
      .map((key) =>
        columnHelper.accessor(key as keyof User, {
          header: key,
          cell: (info) => info.getValue(),
        })
      );
  }, [data, columnFilters]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(table.getFilteredRowModel().rows.map(row => row.original)),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export data');
      }
      const { url } = await response.json();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Export Error:', error);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="p-4">
          {/* Filter Panel */}
          <div className="mb-4 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-medium mb-2">Show/Hide Columns</h3>
            <div className="grid grid-cols-3 gap-4">
              {FILTERABLE_COLUMNS.map(column => (
                <label key={column} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={columnFilters[column]}
                    onChange={e =>
                      setColumnFilters(prev => ({
                        ...prev,
                        [column]: e.target.checked
                      }))
                    }
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    {column.split('_').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() =>
                setColumnFilters(
                  FILTERABLE_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: true }), {})
                )
              }
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reset Filters
            </button>
          </div>

          <div className="mb-4 flex justify-between">
            <input
              type="text"
              placeholder="Searching..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-2 border rounded w-1/3 text-black"
            />
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export to New Google Sheet
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() && (
                            <span>
                              {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-black">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-black">
            <div className="flex gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                {'<'}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                {'>>'}
              </button>
            </div>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
              className="p-2 border rounded text-black"
            >
              {[10, 20, 30, 40, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </Fragment>
  );
}
