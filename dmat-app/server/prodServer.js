import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAIProxyMiddleware } from './aiProxy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Health check endpoint for Render zero-downtime health monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'dmat-prep-app', timestamp: new Date().toISOString() });
});

// AI Proxy API middleware
app.use(createAIProxyMiddleware());

// Serve static frontend build from dist directory
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true
}));

// SPA fallback: any non-static, non-API route returns index.html for React Router
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[dMAT Production Server] Running on http://0.0.0.0:${PORT}`);
});
