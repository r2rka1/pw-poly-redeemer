import { chromium } from "playwright";
import { config } from "./config.js";
import readline from "readline";

async function waitForEnter(prompt: string): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, () => {
      rl.close();
      resolve();
    });
  });
}

async function main() {
  console.log("Launching browser for manual login...");
  console.log(`User data dir: ${config.userDataDir}`);

  const context = await chromium.launchPersistentContext(config.userDataDir, {
    channel: "chrome",
    headless: false,
    viewport: { width: 1280, height: 800 },
    args: [
      "--disable-blink-features=AutomationControlled",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
  });

  const page = context.pages()[0] || (await context.newPage());
  await page.goto(config.polymarketUrl);

  console.log("\nPlease log in to Polymarket in the browser window.");
  console.log("Complete any 2FA or wallet authentication as needed.\n");

  await waitForEnter("Press ENTER here once you are logged in...");

  console.log("Saving session and closing browser...");
  await context.close();
  console.log("Done! Session saved. You can now run: npm run redeem");
}

main().catch((err) => {
  console.error("Login failed:", err);
  process.exit(1);
});
