import { createServer } from "http";
import { parse } from "url";
import next from "next";
import os from "os";
import cluster from "cluster";

// Environment configuration
const isDev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3100', 10);
const hostname = process.env.HOSTNAME || 'localhost';

// Clustering for production environments
const numCPUs = isDev ? 1 : os.cpus().length;

if (cluster.isPrimary && !isDev) {
  console.log(`Master process ${process.pid} is running`);
  
  // Fork workers based on CPU count
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork();
  });
} else {
  // Initialize Next.js app
  const app = next({ 
    dev: isDev, 
    hostname, 
    port,
    // Can add custom configurations here if needed
    conf: {
      poweredByHeader: false,
    }
  });
  
  const handle = app.getRequestHandler();

  // Prepare the application
  app.prepare()
    .then(() => {
      createServer(async (req, res) => {
        try {
          // Add basic security headers
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-Frame-Options', 'DENY');
          res.setHeader('X-XSS-Protection', '1; mode=block');
          
          // Parse the request URL
          const parsedUrl = parse(req.url, true);
          
          // Handle the request
          await handle(req, res, parsedUrl);
        } catch (err) {
          console.error(`Error occurred handling ${req.url}:`, err);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      })
      .once('error', (err) => {
        console.error('Server initialization error:', err);
        process.exit(1);
      })
      .listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port} - env: ${process.env.NODE_ENV}`);
        console.log(`> Worker ${process.pid} started`);
      });
    })
    .catch((err) => {
      console.error('Next.js initialization error:', err);
      process.exit(1);
    });
}