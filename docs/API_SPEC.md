# Backend API Spec (Competing Apps)

## Overview
This UI expects backend endpoints for app review ingestion.
All requests are JSON over HTTPS.

## POST {INGEST_APP_PATH}
Ingest reviews for a single app.

### Request
```
{
  "appId": "app_123",
  "appName": "Example App",
  "country": "United States"
}
```

### Success Response
```
{
  "records": 24,
  "status": "Completed",
  "lastIngestion": "2024-01-01T10:12:00.000Z"
}
```

### Error Response (example)
```
{ "errors": [{ "detail": "appId is required." }] }
```

## POST {REFRESH_APP_PATH}
Refresh reviews for an existing app.

### Request
```
{
  "appId": "app_123"
}
```

### Success Response
```
{
  "records": 18,
  "status": "Completed",
  "lastIngestion": "2024-01-01T10:12:00.000Z"
}
```

## POST {INGEST_ALL_PATH}
Ingest reviews for multiple apps in one request.

### Request
```
{
  "appIds": ["app_123", "app_456"]
}
```

### Success Response
```
{
  "app_123": {
    "records": 24,
    "status": "Completed",
    "lastIngestion": "2024-01-01T10:12:00.000Z"
  },
  "app_456": {
    "records": 12,
    "status": "Completed",
    "lastIngestion": "2024-01-01T10:12:00.000Z"
  }
}
```

## Local Mock Server
- Start: `npm run mock:server`
- Required env vars:
  - `MOCK_SERVER_PORT`
  - `MOCK_INGEST_APP_PATH`
  - `MOCK_REFRESH_APP_PATH`
  - `MOCK_INGEST_ALL_PATH`
- UI config uses:
  - `VITE_API_BASE_URL`
  - `VITE_INGEST_APP_PATH`
  - `VITE_REFRESH_APP_PATH`
  - `VITE_INGEST_ALL_PATH`
