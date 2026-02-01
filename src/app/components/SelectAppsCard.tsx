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
    <div className="border border-[#abb8ca] rounded-md p-[35px_35px_14px_35px] bg-white">
      <div className="flex flex-col gap-8">
        <h2 className="font-['Inter'] font-medium text-base leading-6 tracking-[-0.176px] text-[#0e0f11]">
          Select Apps to Monitor
        </h2>

        <div className="flex gap-10 py-2.5">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-['Inter'] font-medium text-sm text-black">
              Country
            </label>
            <div className="relative">
              <button
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className={`w-full h-10 px-2 border rounded-md flex items-center justify-between text-sm transition-colors ${
                  errors.country
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#ccd6e0] hover:border-[#728095]'
                }`}
                aria-haspopup="listbox"
                aria-expanded={isCountryOpen}
              >
                <span className={country ? 'text-black' : 'text-[#738096]'}>
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
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
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
            <label className="font-['Inter'] font-medium text-sm text-black">
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
              className={`w-full h-10 px-2 border rounded-md text-sm placeholder:text-[#a1adbf] focus:outline-none transition-colors ${
                errors.appName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#ccd6e0] focus:border-[#728095]'
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
            className="bg-[#bbcadf] hover:bg-[#aab9ce] text-[#0f2744] font-['Inter'] font-normal text-base leading-6 tracking-[0.24px] px-3 py-1.5 rounded-[5px] h-10 flex items-center gap-1 transition-colors w-[140px]"
          >
            <Plus className="w-6 h-6" />
            Add more
          </button>

          <button
            onClick={onGetReviews}
            disabled={isLoadingAll}
            className="bg-[#2773ff] hover:bg-[#1b5dd9] disabled:bg-[#93b4ff] text-[#f4f8ff] font-['Inter'] font-medium text-sm leading-7 tracking-[0.21px] px-3 py-2 rounded-[5px] h-10 flex items-center gap-1 transition-colors disabled:cursor-not-allowed"
          >
            {isLoadingAll ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <RefreshCw className="w-6 h-6" />
            )}
            {isLoadingAll ? 'Loading...' : 'Get Reviews'}
          </button>
        </div>
      </div>
    </div>
  );
}
