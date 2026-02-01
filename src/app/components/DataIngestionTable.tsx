import { useEffect, useState } from 'react';
import { RefreshCw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AppData, IngestionStatus } from '@/types/app';

// Re-export for backward compatibility
export type { AppData };

interface DataIngestionTableProps {
  apps: AppData[];
  onRefresh: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DataIngestionTable({ apps, onRefresh, onDelete }: DataIngestionTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const rowsOptions = [5, 10, 15, 20];
  const totalPages = Math.max(1, Math.ceil(apps.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, apps.length);
  const currentApps = apps.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const isRefreshing = (status: IngestionStatus) => status === 'In Progress';

  return (
    <div className="bg-white w-full">
      <div className="px-2 pt-2 pb-4">
        <h3 className="font-['Inter'] font-medium text-sm leading-6 text-[#111827]">
          Data Ingestion Status
        </h3>
        <p className="font-['Inter'] font-normal text-xs leading-4 tracking-[0.16px] text-[#6b7280]">
          Limited reviews ingested for selected Apps
        </p>
      </div>

      <div className="w-full">
        {/* Table Header */}
        <div className="flex bg-[#e0e0e0] h-10">
          <div className="flex-1 flex items-center px-4">
            <span className="font-['Inter'] font-semibold text-xs tracking-[0.16px] text-[#161616]">
              App Name
            </span>
          </div>
          <div className="w-[200px] flex items-center px-4">
            <span className="font-['Inter'] font-semibold text-xs tracking-[0.16px] text-[#161616]">
              Last Ingestion
            </span>
          </div>
          <div className="w-[140px] flex items-center px-4">
            <span className="font-['Inter'] font-semibold text-xs tracking-[0.16px] text-[#161616]">
              Status
            </span>
          </div>
          <div className="w-[120px] flex items-center px-4">
            <span className="font-['Inter'] font-semibold text-xs tracking-[0.16px] text-[#161616]">
              #Records
            </span>
          </div>
          <div className="w-[90px] flex items-center justify-end px-4">
            <span className="font-['Inter'] font-semibold text-xs tracking-[0.16px] text-[#161616]">
              Action
            </span>
          </div>
        </div>

        {/* Table Body */}
        {currentApps.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#6b7280] text-xs">
            No apps added yet. Use the form above to add apps to monitor.
          </div>
        ) : (
          currentApps.map((app) => (
            <div key={app.id} className="flex h-10 border-t border-[#e0e0e0] bg-white">
              <div className="flex-1 flex items-center px-4">
                <span className="font-['Inter'] font-normal text-xs tracking-[0.16px] text-[#525252]">
                  {app.appName}
                </span>
              </div>
              <div className="w-[200px] flex items-center px-4">
                <span className="font-['Inter'] font-normal text-xs tracking-[0.16px] text-[#525252]">
                  {app.lastIngestion || '--'}
                </span>
              </div>
              <div className="w-[140px] flex items-center px-4">
                <span className="font-['Inter'] font-normal text-xs tracking-[0.16px] text-[#525252]">
                  {app.status}
                </span>
              </div>
              <div className="w-[120px] flex items-center px-4">
                <span className="font-['Inter'] font-normal text-xs tracking-[0.16px] text-[#525252]">
                  {app.records > 0 ? app.records.toLocaleString() : '--'}
                </span>
              </div>
              <div className="w-[90px] flex items-center justify-end gap-1 px-4">
                <button
                  onClick={() => onRefresh(app.id)}
                  disabled={isRefreshing(app.status)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Refresh reviews"
                  title="Refresh reviews"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#161616] ${isRefreshing(app.status) ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => onDelete(app.id)}
                  disabled={isRefreshing(app.status)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Delete app"
                  title="Delete app"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#161616]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table Footer with Pagination */}
      {apps.length > 0 && (
        <div className="flex items-center justify-end gap-6 py-2 px-4 border-t border-[#e0e0e0]">
          <div className="flex items-center gap-2">
            <span className="font-['Roboto'] font-normal text-xs leading-[1.66] tracking-[0.4px] text-[rgba(0,0,0,0.6)]">
              Rows per page:
            </span>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3.5 hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
              >
                <span className="font-['Roboto'] font-normal text-xs leading-[1.66] tracking-[0.4px] text-[rgba(0,0,0,0.87)]">
                  {rowsPerPage}
                </span>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M7 9.5L12 14.5L17 9.5H7Z" fill="rgba(0,0,0,0.54)" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded shadow-lg z-10">
                  {rowsOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setRowsPerPage(option);
                        setCurrentPage(1);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-gray-100 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <span className="font-['Roboto'] font-normal text-xs leading-[1.66] tracking-[0.4px] text-[rgba(0,0,0,0.87)]">
            {apps.length > 0 ? `${startIndex + 1}-${endIndex} of ${apps.length}` : '0 of 0'}
          </span>

          <div className="flex items-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6" style={{ opacity: 0.54 }} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6" style={{ opacity: 0.54 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
