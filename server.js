import express from "express";
import next from "next";

const port = 3200;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Allow all routes to be handled by Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port} - env: ${process.env.NODE_ENV}`);
  });
});