// Reads the token the Sanity CLI already stored when you ran `sanity login`.
// Nothing is printed or written anywhere — it stays on this machine, and no
// token ever needs to be pasted into a chat, a file, or an environment variable.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function cliToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;

  const configPath = path.join(os.homedir(), ".config", "sanity", "config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("No Sanity CLI credentials found. Run: npx sanity login");
  }
  const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const token = cfg.authToken || cfg.token;
  if (!token) throw new Error("No auth token in Sanity CLI config. Run: npx sanity login");
  return token;
}
