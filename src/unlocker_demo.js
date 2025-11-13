require('dotenv').config();
const request = require("request-promise");
const fs = require("fs");

// ============================================================================
// CONFIGURATION
// ============================================================================

const TARGET_URL = "https://www.flipkart.com/dell-se-series-55-88-cm-22-inch-full-hd-led-backlit-va-panel-contrast-3000-1-tilt-adjustment-1x-hdmi-1xvga-3-years-warranty-tuv-rheinland-3-star-eye-comfort-ultra-thin-bezel-monitor-se2225hm/p/itm928c341bee303";
const USE_WEB_UNLOCKER = true;
const NUM_REQUESTS = 10;
const RESULTS_DIR = './results';

const PROXY_DC = `http://brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.DATACENTER_ZONE}:${process.env.DATACENTER_PASSWORD}@brd.superproxy.io:33335`;
const PROXY_UNLOCKER = `http://brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.WEB_UNLOCKER_ZONE}:${process.env.WEB_UNLOCKER_PASSWORD}@brd.superproxy.io:33335`;

const proxy = USE_WEB_UNLOCKER ? PROXY_UNLOCKER : PROXY_DC;

const options = {
    url: TARGET_URL,
    proxy,
    method: "GET",
    rejectUnauthorized: false,
};

// ============================================================================
// MAIN
// ============================================================================

if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

let numOfFails = 0;

console.log('=== Web Unlocker Demo ===');
console.log(`Proxy: ${USE_WEB_UNLOCKER ? 'WEB UNLOCKER' : 'DATACENTER'}`);
console.log(`URL: ${TARGET_URL}`);
console.log(`Requests: ${NUM_REQUESTS}\n`);

const sendRequest = (i) => {
    const domain = new URL(TARGET_URL).hostname;
    request(options)
        .then(data => {
            const outputPath = `${RESULTS_DIR}/${domain}_${i}.html`;
            fs.writeFile(outputPath, data, err => {
                if (err) console.error(`✗ Request ${i} save failed: ${err.message}`);
                else console.log(`✓ Request ${i} saved: ${outputPath}`);
            });
        })
        .catch(err => {
            numOfFails++;
            const errorMessage = {
                statusCode: err.statusCode || "Proxy/Script error",
                requestNumber: i,
                responseHeaders: err.response && err.response.headers,
            };
            console.error(`✗ Request ${i} failed: ${errorMessage.statusCode}`);
            const errorPath = `${RESULTS_DIR}/${domain}_failed_${i}.json`;
            fs.writeFile(errorPath, JSON.stringify(errorMessage, null, 2), err => {
                if (err) console.error(`Failed to write error log: ${err.message}`);
            });
        });
};

for (let i = 0; i < NUM_REQUESTS; i++) {
    sendRequest(i);
}

process.on("exit", () => {
    const success = NUM_REQUESTS - numOfFails;
    console.log(`\nDone! Success: ${success}/${NUM_REQUESTS} (${((success/NUM_REQUESTS)*100).toFixed(0)}%)`);
});
