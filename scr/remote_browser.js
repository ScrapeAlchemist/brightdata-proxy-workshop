require('dotenv').config();
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const {open_chrome_with_url} = require('./open_chrome.js');

// ============================================================================
// CONFIGURATION
// ============================================================================

const TARGET_URL = 'https://www.meesho.com/ubon-type-c-tc-186-wired-earphones-wired-gaming-headset-black-in-the-ear/p/8nymhw';
const COUNTRY = 'in';
const DELAY_BEFORE_CLOSE = 60000;
const USE_SCRAPING_BROWSER = false;

const auth = `brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.SCRAPING_BROWSER_ZONE}-country-${COUNTRY}:${process.env.SCRAPING_BROWSER_PASSWORD}`;

async function openDevTools(page) {
    const client = await page.target().createCDPSession();
    const frame_id = page.mainFrame()._id;
    const { url: inspect_url } = await client.send('Page.inspect', {
        frameId: frame_id,
    });
    console.log('DevTools ID:', inspect_url.split('9223/')[1]);
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    open_chrome_with_url(inspect_url.split('9223/')[1]);
}

async function run() {
    let browser;

    const resultsDir = 'sbr_results';
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    console.log('=== Scraping Browser Demo ===');
    console.log(`Mode: ${USE_SCRAPING_BROWSER ? 'REMOTE SCRAPING BROWSER' : 'LOCAL CHROME'}`);
    console.log(`Country: ${COUNTRY}`);
    console.log(`URL: ${TARGET_URL}\n`);

    try {
        if (USE_SCRAPING_BROWSER) {
            browser = await puppeteer.connect({
                browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
            });
        } else {
            browser = await puppeteer.launch({
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                headless: false,
            });
        }

        const page = await browser.newPage();

        if (USE_SCRAPING_BROWSER) {
            await openDevTools(page);
        }

        console.log('Loading page...');
        await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

        console.log('Waiting for network idle...');
        await page.waitForNetworkIdle({ idleTime: 2000, timeout: 30000 });
        console.log('✓ Page loaded');

        await page.screenshot({ path: './sbr_results/screen.jpg' });
        console.log('✓ Screenshot saved: ./sbr_results/screen.jpg');

        const html = await page.evaluate(() => document.documentElement.outerHTML);
        await new Promise((resolve, reject) => {
            fs.writeFile('./sbr_results/data.html', html, (err) => {
                if (err) reject(err);
                else {
                    console.log('✓ HTML saved: ./sbr_results/data.html');
                    resolve();
                }
            });
        });

        console.log(`\nWaiting ${DELAY_BEFORE_CLOSE / 1000}s before closing (inspect in DevTools if needed)...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BEFORE_CLOSE));

        console.log('Done!');
   } catch (e) {
       console.error(`✗ Error: ${e.message}`);
   } finally {
       if (browser) {
           await browser.close();
       }
   }
}

run().catch(console.error);
