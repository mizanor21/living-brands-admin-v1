// server.js
import { createServer } from "http";
import { parse } from "url";
import next from "next";

//process.env.NODE_ENV !== 'production'

const dev = false;
const hostname = "localhost";
const port = process.env.port || 3100;
// when using middleware hostname and port must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass true as the second argument to url.parse.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log("> Ready on http://${hostname}:${port}");
    });
});
