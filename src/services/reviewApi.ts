/**
 * Mock API service for app review ingestion
 * Simulates fetching reviews from App Store and Google Play Store
 *
 * Replace these functions with real API calls when backend is ready
 */

import type { IngestionStatus } from '@/types/app';

export interface IngestionResult {
  records: number;
  status: IngestionStatus;
  lastIngestion: string;
}

export interface AppInfo {
  id: string;
  appName: string;
  country: string;
}

/**
 * Generates a unique ID for new apps
 */
export function generateAppId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `app_${crypto.randomUUID()}`;
  }

  return `app_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Formats a date for display in the table
 */
function formatIngestionDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Simulates network delay (1-3 seconds)
 */
function simulateNetworkDelay(): Promise<void> {
  const delay = 1000 + Math.random() * 2000;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Mock API: Ingest reviews for a single app
 *
 * In production, this would call:
 * POST /api/apps/{appId}/ingest
 *
 * @param appInfo - The app to ingest reviews for
 * @returns Promise with ingestion result (record count, status, timestamp)
 */
export async function ingestReviewsForApp(appInfo: AppInfo): Promise<IngestionResult> {
  // Simulate network delay
  await simulateNetworkDelay();

  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    return {
      records: 0,
      status: 'Failed',
      lastIngestion: formatIngestionDate(new Date())
    };
  }

  // Return successful result with random record count (10-35)
  const records = Math.floor(Math.random() * 26) + 10;

  return {
    records,
    status: 'Completed',
    lastIngestion: formatIngestionDate(new Date())
  };
}

/**
 * Mock API: Refresh/re-ingest reviews for an existing app
 *
 * In production, this would call:
 * POST /api/apps/{appId}/refresh
 *
 * @param appId - The ID of the app to refresh
 * @returns Promise with ingestion result
 */
export async function refreshAppReviews(appId: string): Promise<IngestionResult> {
  // Simulate network delay
  await simulateNetworkDelay();

  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    return {
      records: 0,
      status: 'Failed',
      lastIngestion: formatIngestionDate(new Date())
    };
  }

  // Return successful result with random record count (10-35)
  const records = Math.floor(Math.random() * 26) + 10;

  return {
    records,
    status: 'Completed',
    lastIngestion: formatIngestionDate(new Date())
  };
}

/**
 * Mock API: Ingest reviews for multiple apps
 *
 * In production, this would call:
 * POST /api/apps/ingest-all
 *
 * @param appIds - Array of app IDs to ingest
 * @returns Promise that resolves when all ingestions complete
 */
export async function ingestReviewsForAllApps(
  appIds: string[]
): Promise<Map<string, IngestionResult>> {
  const results = new Map<string, IngestionResult>();

  const buildFailedResult = (): IngestionResult => ({
    records: 0,
    status: 'Failed',
    lastIngestion: formatIngestionDate(new Date())
  });

  // Process all apps in parallel, but isolate failures per app
  const promises = appIds.map(async (appId) => {
    try {
      const result = await refreshAppReviews(appId);
      results.set(appId, result);
    } catch {
      results.set(appId, buildFailedResult());
    }
  });

  await Promise.all(promises);

  return results;
}
