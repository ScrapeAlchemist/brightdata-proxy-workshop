require('dotenv').config();
const puppeteer = require('puppeteer-core');

// ============================================================================
// CONFIGURATION
// ============================================================================

const TARGET_URL = 'https://www.amazon.in/dp/B0CS5XW6TN/';
const USE_RESIDENTIAL = true;
const USE_REAL_BROWSER = true;
const BLOCK_REQUESTS = false;
const USE_HEADERS = true;
const USE_COOKIES = false;

const ZONE = USE_RESIDENTIAL ? process.env.RESIDENTIAL_ZONE : process.env.DATACENTER_ZONE;
const PASSWORD = USE_RESIDENTIAL ? process.env.RESIDENTIAL_PASSWORD : process.env.DATACENTER_PASSWORD;
const PROXY_HOST = 'brd.superproxy.io:33335';
const PROXY_USERNAME = `brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${ZONE}`;
const PROXY_PASSWORD = PASSWORD;

const DEFAULT_HEADERS = {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
};

const COOKIES = {
  'i18n-prefs': 'USD',
  'ubid-main': '132-0756542-7805023',
  'lc-main': 'en_US',
  'session-id': '136-8069771-7581952',
  'session-id-time': '2082787201l',
  'sp-cdn': '"L5Z9:IL"',
  'session-token': 'MlxXDHC9nH8u8deHS2wGd09dgYg2nUWf8YUrCX6V5yU4+lZrBDBOB5uF2N2DuAX/o9UnK42LLztHqhN/wzQ81TyHpD3r1Fv4ZdZJWcJF4GmnHgWYAPCswOjTABmD+Dc8ReiLx5GzYGrmN1orq8h0s8zhkTwlGSShrelswH6iYrWEa3AlGW93ab5/Ml5GNZCs3oFhwR0Wn1fAAL9T+kqSzLZC569rz5f4JOupzYTlq3S9ouxB/b/f2G8PLE42h7jCL9Nq9uCAXi1Yxa7+/mFiMb/gwgp2q4Ptfw0mDczzMav4feWDDAUqSev139lvQu7IZRhu6Es1X1UOTjp6uMHpcgqvtGo/P6Pu',
  'skin': 'noskin',
};

async function run() {
  console.log('=== Browser with Proxy Demo ===');
  console.log(`Proxy: ${USE_RESIDENTIAL ? 'RESIDENTIAL' : 'DATACENTER'} (${ZONE})`);
  console.log(`Headers: ${USE_HEADERS ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Cookies: ${USE_COOKIES ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Block Requests: ${BLOCK_REQUESTS ? 'ENABLED' : 'DISABLED'}\n`);

  const launchOptions = {
    headless: false,
    args: [
      `--proxy-server=${PROXY_HOST}`,
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
    ],
  };

  if (USE_REAL_BROWSER) {
    launchOptions.executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  }

  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Authenticate with proxy
    await page.authenticate({
      username: PROXY_USERNAME,
      password: PROXY_PASSWORD,
    });

    const { width, height } = await page.evaluate(() => ({
      width: window.screen.availWidth,
      height: window.screen.availHeight,
    }));
    await page.setViewport({ width, height });

    if (USE_HEADERS) {
      await page.setExtraHTTPHeaders(DEFAULT_HEADERS);
    }

    if (USE_COOKIES) {
      const domain = new URL(TARGET_URL).hostname;
      await page.setCookie(
        ...Object.entries(COOKIES).map(([name, value]) => ({
          name,
          value,
          domain,
        }))
      );
    }

    if (BLOCK_REQUESTS) {
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });
    }

    console.log(`Loading: ${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(10000);

    const domain = new URL(TARGET_URL).hostname;
    const screenshotPath = `screenshot_${domain}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`✓ Screenshot saved: ${screenshotPath}`);

    await browser.close();
    console.log('\nDone!');
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
  }
}

run().catch(console.error);
