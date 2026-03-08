import path from "path";

export const config = {
  polymarketUrl: process.env.POLYMARKET_URL || "https://polymarket.com",
  refreshIntervalMs: Number(process.env.REFRESH_INTERVAL_MS) || 30_000,
  userDataDir: process.env.USER_DATA_DIR || path.resolve(import.meta.dirname, "..", "user-data"),
};
