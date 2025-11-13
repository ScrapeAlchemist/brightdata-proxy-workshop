require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const axios = require('axios');
const fs = require('fs').promises;
const { HttpsProxyAgent } = require('https-proxy-agent');

// ============================================================================
// CONFIGURATION
// ============================================================================

const TARGET_URL = "https://www.flipkart.com/samsung-essential-series-s3-55-88-cm-22-inch-full-hd-led-backlit-ips-panel-d-sub-hdmi-flat-monitor-ls22d300gawxxl/p/itm909c8202e1864?pid=MONH7GHGSGF3AGM9&lid=LSTMONH7GHGSGF3AGM9N3DVIC&marketplace=FLIPKART&store=6bo%2Fg0i%2F9no&srno=b_1_1&otracker=browse&otracker1=hp_rich_navigation_PINNED_neo%2Fmerchandising_NA_NAV_EXPANDABLE_navigationCard_cc_3_L2_view-all&fm=organic&iid=en_RhwiE6r6Miduy63EsZd4qEZDJFI3FLgi6M2HKyZGu31a7J_gXA2k8QgcPlEtNaJp7iNsvuwI36y4U6Wi1tyWrPUFjCTyOHoHZs-Z5_PS_w0%3D&ppt=hp&ppn=homepage&ssid=vqdg882g9s0000001763032735096";
const USE_WEB_UNLOCKER = true;
const NUM_REQUESTS = 10;
const RESULTS_DIR = './results';

const PROXY_DC = `http://brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.DATACENTER_ZONE}:${process.env.DATACENTER_PASSWORD}@brd.superproxy.io:33335`;
const PROXY_UNLOCKER = `http://brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.WEB_UNLOCKER_ZONE}:${process.env.WEB_UNLOCKER_PASSWORD}@brd.superproxy.io:33335`;

const PROXY = USE_WEB_UNLOCKER ? PROXY_UNLOCKER : PROXY_DC;

// ============================================================================
// MAIN
// ============================================================================

async function run() {
  const resultsDir = RESULTS_DIR;
  if (!require('fs').existsSync(resultsDir)) {
    require('fs').mkdirSync(resultsDir, { recursive: true });
  }

  console.log('=== Web Unlocker Demo ===');
  console.log(`Proxy: ${USE_WEB_UNLOCKER ? 'WEB UNLOCKER' : 'DATACENTER'}`);
  console.log(`URL: ${TARGET_URL}`);
  console.log(`Requests: ${NUM_REQUESTS}\n`);

  const requests = Array.from({ length: NUM_REQUESTS }, (_, i) => sendRequest(i));
  const results = await Promise.allSettled(requests);

  const successes = results.filter(r => r.status === 'fulfilled').length;
  const failures = results.filter(r => r.status === 'rejected').length;

  console.log(`\nDone! Success: ${successes}/${NUM_REQUESTS} (${((successes/NUM_REQUESTS)*100).toFixed(0)}%)`);
}

async function sendRequest(requestNumber) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const agent = new HttpsProxyAgent(PROXY);
    const requestOptions = {
      httpsAgent: agent,
      timeout: 30000,
    };

    const response = await axios.get(TARGET_URL, requestOptions);
    const domain = new URL(TARGET_URL).hostname;
    const outputPath = `${RESULTS_DIR}/${domain}_${requestNumber}.html`;

    await fs.writeFile(outputPath, response.data);
    console.log(`✓ Request ${requestNumber} saved: ${outputPath}`);
  } catch (error) {
    const domain = new URL(TARGET_URL).hostname;
    const errorMessage = {
      statusCode: error.response?.status || error.code || "Proxy/Script error",
      requestNumber: requestNumber,
      error: error.message,
      responseHeaders: error.response?.headers,
    };

    console.error(`✗ Request ${requestNumber} failed: ${errorMessage.statusCode}`);

    const errorPath = `${RESULTS_DIR}/${domain}_failed_${requestNumber}.json`;
    await fs.writeFile(errorPath, JSON.stringify(errorMessage, null, 2));

    throw error; // Re-throw to count as failed in Promise.allSettled
  }
}

run().catch(console.error);
