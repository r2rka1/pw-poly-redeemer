# pw-polymarket-reedeemer

Automated Polymarket winnings claimer built with Playwright.

Monitors your Polymarket portfolio page and automatically claims available winnings on a configurable schedule.

## Prerequisites

- Node.js 18+
- Google Chrome installed on your system

## Setup

```bash
npm install
npx playwright install chrome
```

## Usage

### 1. Login (manual, one-time)

```bash
npm run login
```

Opens a Chrome browser window. Log in to Polymarket manually (including 2FA / wallet auth). Press ENTER in the terminal once logged in. Your session is saved locally in `user-data/` and reused by the redeem script.

### 2. Auto-claim winnings

```bash
npm run redeem
```

Launches Chrome with your saved session, navigates to `/portfolio`, and checks for claimable winnings every 30 seconds. When a Claim button is found, it automatically clicks through the claim flow.

Press `Ctrl+C` to stop.

### Configuration

Set environment variables to customize behavior:

| Variable | Default | Description |
|---|---|---|
| `POLYMARKET_URL` | `https://polymarket.com` | Base Polymarket URL |
| `REFRESH_INTERVAL_MS` | `30000` | How often to check for claims (ms) |
| `USER_DATA_DIR` | `./user-data` | Browser profile directory |

Example:

```bash
REFRESH_INTERVAL_MS=60000 npm run redeem
```

## Notes

- Re-run `npm run login` if your session expires
- The browser runs in headed mode (visible window) to avoid automation detection
- `user-data/` contains your browser session and is gitignored — never commit it
