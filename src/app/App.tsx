import { useState, useCallback } from 'react';
import { CompetitionAppsHeader } from '@/app/components/CompetitionAppsHeader';
import { SelectAppsCard } from '@/app/components/SelectAppsCard';
import { DataIngestionTable } from '@/app/components/DataIngestionTable';
import type { AppData, NewAppInput } from '@/types/app';
import {
  generateAppId,
  ingestReviewsForApp,
  refreshAppReviews,
  ingestReviewsForAllApps
} from '@/services/reviewApi';

export default function App() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  // Helper to update a single app in the state
  const updateApp = useCallback((id: string, updates: Partial<AppData>) => {
    setApps(currentApps =>
      currentApps.map(app =>
        app.id === id ? { ...app, ...updates } : app
      )
    );
  }, []);

  // Add a new app and immediately start ingestion
  const handleAddApp = useCallback(async (input: NewAppInput) => {
    const newApp: AppData = {
      id: generateAppId(),
      appName: input.appName,
      country: input.country,
      lastIngestion: '',
      status: 'Pending',
      records: 0
    };

    // Add app to table immediately
    setApps(currentApps => [...currentApps, newApp]);

    // Update status to "In Progress"
    updateApp(newApp.id, { status: 'In Progress' });

    // Start ingestion
    try {
      const result = await ingestReviewsForApp({
        id: newApp.id,
        appName: newApp.appName,
        country: newApp.country
      });

      updateApp(newApp.id, {
        status: result.status,
        records: result.records,
        lastIngestion: result.lastIngestion
      });
    } catch {
      updateApp(newApp.id, { status: 'Failed' });
    }
  }, [updateApp]);

  // Refresh reviews for a single app
  const handleRefresh = useCallback(async (id: string) => {
    // Update status to "In Progress"
    updateApp(id, { status: 'In Progress' });

    try {
      const result = await refreshAppReviews(id);

      updateApp(id, {
        status: result.status,
        records: result.records,
        lastIngestion: result.lastIngestion
      });
    } catch {
      updateApp(id, { status: 'Failed' });
    }
  }, [updateApp]);

  // Get reviews for all apps
  const handleGetReviews = useCallback(async () => {
    if (apps.length === 0) return;

    setIsLoadingAll(true);

    // Update all apps to "In Progress"
    setApps(currentApps =>
      currentApps.map(app => ({ ...app, status: 'In Progress' as const }))
    );

    try {
      const results = await ingestReviewsForAllApps(apps.map(app => app.id));

      setApps(currentApps =>
        currentApps.map(app => {
          const result = results.get(app.id);
          if (result) {
            return {
              ...app,
              status: result.status,
              records: result.records,
              lastIngestion: result.lastIngestion
            };
          }
          return app;
        })
      );
    } catch {
      setApps(currentApps =>
        currentApps.map(app => ({ ...app, status: 'Failed' as const }))
      );
    } finally {
      setIsLoadingAll(false);
    }
  }, [apps]);

  // Delete an app
  const handleDelete = useCallback((id: string) => {
    setApps(currentApps => currentApps.filter(app => app.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-[1140px] mx-auto">
        <CompetitionAppsHeader />

        <p className="font-['Manrope'] text-base leading-7 tracking-[-0.176px] text-[#636b75] mb-8">
          Add a list of apps which you want Allyvate to monitor for reviews. New reviews are fetched daily. You can also trigger the fetch manually.
        </p>

        <div className="w-full h-px bg-[#8798AD] mb-8" />

        <div className="space-y-12">
          <SelectAppsCard
            onAddApp={handleAddApp}
            onGetReviews={handleGetReviews}
            isLoadingAll={isLoadingAll}
          />

          <DataIngestionTable
            apps={apps}
            onRefresh={handleRefresh}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
