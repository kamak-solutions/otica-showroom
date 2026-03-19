import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticFiles from '@fastify/static';
import multipart from '@fastify/multipart';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import produtosRoutes from './routes/produtos.js';
import adminRoutes from './routes/admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fastify = Fastify({
  logger:{
    transport:{
      target:"pino-pretty"
    }
  }
});

await fastify.register(cors, { origin: '*' });

// Registra multipart ANTES das rotas
await fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Serve arquivos estáticos da pasta public
await fastify.register(staticFiles, {
  root: join(__dirname, 'public'),
  prefix: '/',
});

await fastify.register(produtosRoutes);
await fastify.register(adminRoutes);

// Health check
fastify.get('/health', async () => ({ status: 'ok' }));

try {
  await fastify.listen({
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}