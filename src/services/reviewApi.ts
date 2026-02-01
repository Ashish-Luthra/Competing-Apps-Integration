/**
 * Mock API service for app review ingestion
 * Simulates fetching reviews from App Store and Google Play Store
 *
 * Replace these functions with real API calls when backend is ready
 */

import type { IngestionStatus } from '@/types/app';
import {
  API_BASE_URL,
  INGEST_APP_PATH,
  REFRESH_APP_PATH,
  INGEST_ALL_PATH,
} from '@/app/config/api';

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

function buildUrl(pathTemplate: string, params: Record<string, string>): string {
  const path = Object.entries(params).reduce((current, [key, value]) => {
    return current.replaceAll(`{${key}}`, encodeURIComponent(value));
  }, pathTemplate);
  return `${API_BASE_URL}${path}`;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.errors?.[0]?.detail || `API request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
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
  const url = buildUrl(INGEST_APP_PATH, { appId: appInfo.id });
  return postJson<IngestionResult>(url, {
    appId: appInfo.id,
    appName: appInfo.appName,
    country: appInfo.country,
  });
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
  const url = buildUrl(REFRESH_APP_PATH, { appId });
  return postJson<IngestionResult>(url, { appId });
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
  const url = buildUrl(INGEST_ALL_PATH, {});
  const response = await postJson<Record<string, IngestionResult>>(url, { appIds });
  return new Map(Object.entries(response));
}
