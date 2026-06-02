import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "./app.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

if (!process.env.VERCEL) {
  config({ path: resolve(__dirname, "../../../.env") });
}

const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Futuristic API listening on http://${host}:${port}`);
});
