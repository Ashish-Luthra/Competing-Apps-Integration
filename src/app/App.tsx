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

    const appIds = apps.map(app => app.id);
    const appIdSet = new Set(appIds);
    setIsLoadingAll(true);

    // Update all apps to "In Progress"
    setApps(currentApps =>
      currentApps.map(app =>
        appIdSet.has(app.id) ? { ...app, status: 'In Progress' as const } : app
      )
    );

    try {
      const results = await ingestReviewsForAllApps(appIds);

      setApps(currentApps =>
        currentApps.map(app => {
          if (!appIdSet.has(app.id)) {
            return app;
          }
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
        currentApps.map(app =>
          appIdSet.has(app.id) ? { ...app, status: 'Failed' as const } : app
        )
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
    <div className="min-h-screen bg-white">
      <div className="page-frame page-frame--nav-expanded">
        <div className="page-content">
          <CompetitionAppsHeader />

          <p className="font-['Inter'] text-sm leading-6 tracking-[-0.14px] text-[#667085] mb-6">
            Add a list of apps which you want Allyvate to monitor for reviews. New reviews are fetched daily. You can also trigger the fetch manually.
          </p>

          <div className="w-full h-px bg-[#c9d6ef] mb-7" />

          <div className="space-y-10">
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
    </div>
  );
}
