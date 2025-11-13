require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const { HttpsProxyAgent } = require('https-proxy-agent');

// ============================================================================
// CONFIGURATION
// ============================================================================

const TARGET_URL = 'https://www.amazon.in/dp/B0CS5XW6TN/';
const USE_RESIDENTIAL = false;
const USE_HEADERS = false;
const USE_COOKIES = false;
const NUM_REQUESTS = 10;

const ZONE = USE_RESIDENTIAL ? process.env.RESIDENTIAL_ZONE : process.env.DATACENTER_ZONE;
const PASSWORD = USE_RESIDENTIAL ? process.env.RESIDENTIAL_PASSWORD : process.env.DATACENTER_PASSWORD;
const PROXY = `http://brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${ZONE}:${PASSWORD}@brd.superproxy.io:33335`;
const DEFAULT_HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Priority': 'u=0, i',
  'Referer': 'https://www.amazon.in/',
  'Sec-CH-UA': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
  'Sec-CH-UA-Mobile': '?0',
  'Sec-CH-UA-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
};

const COOKIES = {
  'csm-sid': '274-2166109-9384747',
  'x-amz-captcha-1': '1762968865593975',
  'x-amz-captcha-2': '0QFJhpDg65cN3m7Tzzy3Eg==',
}; 

async function run() {
  const resultsDir = 'results';
  if (!require('fs').existsSync(resultsDir)) {
    require('fs').mkdirSync(resultsDir, { recursive: true });
  }

  console.log('=== Simple HTTP Request Demo ===');
  console.log(`Proxy: ${USE_RESIDENTIAL ? 'RESIDENTIAL' : 'DATACENTER'} (${ZONE})`);
  console.log(`Headers: ${USE_HEADERS ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Cookies: ${USE_COOKIES ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Requests: ${NUM_REQUESTS}\n`);

  const requests = Array.from({ length: NUM_REQUESTS }, (_, i) => sendRequest(i + 1));
  await Promise.all(requests);

  console.log('\nDone! Check the results folder for outputs.');
}

async function sendRequest(requestNumber) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const agent = new HttpsProxyAgent(PROXY);
    const requestOptions = {
      headers: {},
      httpsAgent: agent,
      timeout: 30000,
    };

    if (USE_HEADERS) {
      requestOptions.headers = DEFAULT_HEADERS;
    }

    if (USE_COOKIES) {
      requestOptions.headers['Cookie'] = Object.entries(COOKIES)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
    }

    const response = await axios.get(TARGET_URL, requestOptions);
    const domain = new URL(TARGET_URL).hostname;
    const outputPath = `results/${domain}_${requestNumber}.html`;

    await fs.writeFile(outputPath, response.data);
    console.log(`✓ Request ${requestNumber} saved: ${outputPath}`);
  } catch (error) {
    console.error(`✗ Request ${requestNumber} failed: ${error.message}`);
  }
}

run().catch(console.error);