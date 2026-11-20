import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const files = new Map([
  ["/", ["index.html", "text/html"]],
  ["/index.html", ["index.html", "text/html"]],
  ["/style.css", ["style.css", "text/css"]],
  ["/portfolio.js", ["portfolio.js", "text/javascript"]],
]);

const port = Number(process.env.PORTFOLIO_PORT || 4187);
const host = "127.0.0.1";

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  const path = request.url.split("?")[0];
  const asset = /^\/assets\/([a-z0-9-]+\.(jpg|png))$/.exec(path);
  const file = asset
    ? ["assets/" + asset[1], asset[2] === "jpg" ? "image/jpeg" : "image/png"]
    : files.get(path);
  if (!file) {
    response.writeHead(404).end();
    return;
  }

  const [name, type] = file;
  try {
    const content = await readFile(new URL("./public/" + name, import.meta.url));
    response.writeHead(200, {
      "Content-Type": type.startsWith("image/") ? type : type + "; charset=utf-8",
      "Content-Length": content.length,
      "Cache-Control": "no-cache",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.writeHead(404).end();
      return;
    }
    console.error(error);
    response.writeHead(500).end("Unable to load the page.");
  }
});

server.listen(port, host, () => console.log("Local portfolio at http://" + host + ":" + port));
