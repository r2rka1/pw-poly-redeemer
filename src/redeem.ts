import { chromium } from "playwright";
import { config } from "./config.js";

const PORTFOLIO_URL = `${config.polymarketUrl}/portfolio`;

async function checkAndRedeem(page: import("playwright").Page): Promise<boolean> {
  const claimButton = page.getByRole("button", { name: "Claim" }).first();

  if (await claimButton.isVisible({ timeout: 10_000 }).catch(() => false)) {
    console.log("Claim button found! Clicking...");
    await claimButton.click();

    // Wait for the modal/form to appear, then click the confirm Claim button inside it
    const modal = page.locator('[role="dialog"], [data-radix-popper-content-wrapper], [class*="modal"], [class*="Modal"]').first();
    await modal.waitFor({ state: "visible", timeout: 10_000 });
    const confirmClaim = modal.getByRole("button", { name: /claim/i });
    await confirmClaim.waitFor({ state: "visible", timeout: 10_000 });
    console.log("Confirming claim...");
    await confirmClaim.click();

    // Wait for Done button and click it
    const doneButton = page.getByRole("button", { name: "Done" });
    await doneButton.waitFor({ state: "visible", timeout: 30_000 });
    console.log("Clicking Done...");
    await doneButton.click();

    console.log("Claim completed successfully!");
    return true;
  }

  return false;
}

async function main() {
  console.log("Launching browser with saved session...");
  console.log(`Refresh interval: ${config.refreshIntervalMs / 1000}s`);

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
  await page.goto(PORTFOLIO_URL, { waitUntil: "domcontentloaded" });

  console.log("Entering claim check loop. Press Ctrl+C to stop.\n");

  const cleanup = async () => {
    console.log("\nShutting down...");
    await context.close();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  while (true) {
    try {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] Checking for claimable winnings...`);

      await page.reload({ waitUntil: "networkidle" });

      const claimed = await checkAndRedeem(page);
      if (claimed) {
        console.log("Claim complete. Continuing to monitor...");
      } else {
        console.log("No Claim button found. Waiting...");
      }
    } catch (err) {
      console.error("Error during check:", err);
    }

    await new Promise((resolve) => setTimeout(resolve, config.refreshIntervalMs));
  }
}

main().catch((err) => {
  console.error("Redeemer failed:", err);
  process.exit(1);
});
