import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Lost & Found app: http://localhost:${env.port}`);
  console.log(`API health check: http://localhost:${env.port}/api/health`);
});
