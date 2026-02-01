/**
 * Shared types for app monitoring
 */

export type IngestionStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed';

export interface AppData {
  id: string;
  appName: string;
  country: string;
  lastIngestion: string;
  status: IngestionStatus;
  records: number;
}

export interface NewAppInput {
  country: string;
  appName: string;
}
