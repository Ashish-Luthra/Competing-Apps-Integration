import express from 'express';

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const toExpressPath = (template) => template.replaceAll('{appId}', ':appId');

const app = express();
const port = Number(requireEnv('MOCK_SERVER_PORT'));
const ingestAppPath = requireEnv('MOCK_INGEST_APP_PATH');
const refreshAppPath = requireEnv('MOCK_REFRESH_APP_PATH');
const ingestAllPath = requireEnv('MOCK_INGEST_ALL_PATH');

app.use(express.json({ limit: '1mb' }));

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.options('*', (_, res) => {
  res.status(204).end();
});

const buildResult = () => ({
  records: Math.floor(Math.random() * 26) + 10,
  status: 'Completed',
  lastIngestion: new Date().toISOString(),
});

app.post(toExpressPath(ingestAppPath), (req, res) => {
  const { appId } = req.params;
  if (!appId) {
    return res.status(400).json({
      errors: [{ detail: 'appId is required.' }],
    });
  }
  return res.status(200).json(buildResult());
});

app.post(toExpressPath(refreshAppPath), (req, res) => {
  const { appId } = req.params;
  if (!appId) {
    return res.status(400).json({
      errors: [{ detail: 'appId is required.' }],
    });
  }
  return res.status(200).json(buildResult());
});

app.post(ingestAllPath, (req, res) => {
  const { appIds } = req.body || {};
  if (!Array.isArray(appIds) || appIds.length === 0) {
    return res.status(400).json({
      errors: [{ detail: 'appIds is required.' }],
    });
  }
  const results = appIds.reduce((acc, id) => {
    acc[id] = buildResult();
    return acc;
  }, {});
  return res.status(200).json(results);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock server running at http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Ingest app path: ${ingestAppPath}`);
  // eslint-disable-next-line no-console
  console.log(`Refresh app path: ${refreshAppPath}`);
  // eslint-disable-next-line no-console
  console.log(`Ingest all path: ${ingestAllPath}`);
});
