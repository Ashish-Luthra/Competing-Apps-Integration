import { useState } from 'react';
import { Plus, RefreshCw, ChevronDown, Loader2 } from 'lucide-react';
import type { NewAppInput } from '@/types/app';

interface SelectAppsCardProps {
  onAddApp: (app: NewAppInput) => void;
  onGetReviews: () => void;
  isLoadingAll?: boolean;
}

export function SelectAppsCard({ onAddApp, onGetReviews, isLoadingAll = false }: SelectAppsCardProps) {
  const [country, setCountry] = useState('');
  const [appName, setAppName] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [errors, setErrors] = useState<{ country?: string; appName?: string }>({});

  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'India'
  ];

  const validateForm = (): boolean => {
    const newErrors: { country?: string; appName?: string } = {};

    if (!country) {
      newErrors.country = 'Please select a country';
    }

    if (!appName.trim()) {
      newErrors.appName = 'Please enter an app name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMore = () => {
    if (validateForm()) {
      onAddApp({
        country,
        appName: appName.trim()
      });
      setCountry('');
      setAppName('');
      setErrors({});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddMore();
    }
  };

  return (
    <div className="border border-[#b9c7dc] rounded-md p-6 bg-white">
      <div className="flex flex-col gap-6">
        <h2 className="font-['Inter'] font-medium text-sm leading-5 tracking-[-0.12px] text-[#111827]">
          Select Apps to Monitor
        </h2>

        <div className="flex gap-8">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-['Inter'] font-medium text-xs text-[#111827]">
              Country
            </label>
            <div className="relative">
              <button
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className={`w-full h-9 px-2.5 border rounded-md flex items-center justify-between text-xs transition-colors ${
                  errors.country
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#d7e0ea] hover:border-[#8fa3bf]'
                }`}
                aria-haspopup="listbox"
                aria-expanded={isCountryOpen}
              >
                <span className={country ? 'text-[#111827]' : 'text-[#8b97aa]'}>
                  {country || 'Select country'}
                </span>
                <ChevronDown className="w-[18px] h-[18px] text-[#728095]" />
              </button>

              {isCountryOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#ccd6e0] rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                  {countries.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCountry(c);
                        setIsCountryOpen(false);
                        setErrors((prev) => ({ ...prev, country: undefined }));
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.country && (
              <span className="text-red-500 text-xs">{errors.country}</span>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <label className="font-['Inter'] font-medium text-xs text-[#111827]">
              App Name
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => {
                setAppName(e.target.value);
                if (errors.appName) {
                  setErrors((prev) => ({ ...prev, appName: undefined }));
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search by app name..."
              className={`w-full h-9 px-2.5 border rounded-md text-xs placeholder:text-[#a1adbf] focus:outline-none transition-colors ${
                errors.appName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#d7e0ea] focus:border-[#8fa3bf]'
              }`}
            />
            {errors.appName && (
              <span className="text-red-500 text-xs">{errors.appName}</span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddMore}
            className="bg-[#b8c8de] hover:bg-[#a8b9d1] text-[#0f2744] font-['Inter'] font-normal text-xs leading-5 tracking-[0.2px] px-3 py-2 rounded-[5px] h-8 flex items-center gap-1 transition-colors w-[120px]"
          >
            <Plus className="w-4 h-4" />
            Add more
          </button>

          <button
            onClick={onGetReviews}
            disabled={isLoadingAll}
            className="bg-[#2f74ff] hover:bg-[#1f5fdc] disabled:bg-[#93b4ff] text-white font-['Inter'] font-medium text-xs leading-5 tracking-[0.2px] px-3 py-2 rounded-[5px] h-8 flex items-center gap-1.5 transition-colors disabled:cursor-not-allowed"
          >
            {isLoadingAll ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isLoadingAll ? 'Loading...' : 'Get Reviews'}
          </button>
        </div>
      </div>
    </div>
  );
}
