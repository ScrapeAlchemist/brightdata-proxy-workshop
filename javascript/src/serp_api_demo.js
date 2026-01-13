require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const axios = require('axios');
const fs = require('fs').promises;

// ============================================================================
// CONFIGURATION
// ============================================================================

const SEARCH_QUERY = "web scraping tutorial";
const SEARCH_ENGINE = "google"; // "google" | "bing" | "duckduckgo"
const USE_JSON_PARSING = true;  // Toggle for brd_json=1 (structured JSON output)
const COUNTRY = "us";           // For Google: gl parameter
const LANGUAGE = "en";          // For Google: hl parameter
const NUM_REQUESTS = 5;
const RESULTS_DIR = './results';

// API Configuration
const API_ENDPOINT = "https://api.brightdata.com/request";
const API_TOKEN = process.env.SERP_API_TOKEN;
const SERP_ZONE = process.env.SERP_API_ZONE || 'serp';

// ============================================================================
// SEARCH ENGINE URL BUILDER
// ============================================================================

function buildSearchUrl(query, engine, country, language, useJson) {
  const encodedQuery = encodeURIComponent(query);
  const jsonParam = useJson ? '&brd_json=1' : '';

  switch (engine.toLowerCase()) {
    case 'google':
      return `https://www.google.com/search?q=${encodedQuery}&gl=${country}&hl=${language}${jsonParam}`;
    case 'bing':
      return `https://www.bing.com/search?q=${encodedQuery}${jsonParam}`;
    case 'duckduckgo':
      return `https://duckduckgo.com/?q=${encodedQuery}${jsonParam}`;
    default:
      throw new Error(`Unsupported search engine: ${engine}`);
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function run() {
  if (!API_TOKEN) {
    console.error('Error: SERP_API_TOKEN not found in environment variables.');
    console.error('Please add your API token to the .env file.');
    process.exit(1);
  }

  const resultsDir = RESULTS_DIR;
  if (!require('fs').existsSync(resultsDir)) {
    require('fs').mkdirSync(resultsDir, { recursive: true });
  }

  const searchUrl = buildSearchUrl(SEARCH_QUERY, SEARCH_ENGINE, COUNTRY, LANGUAGE, USE_JSON_PARSING);

  console.log('=== SERP API Demo ===');
  console.log(`Search Engine: ${SEARCH_ENGINE.toUpperCase()}`);
  console.log(`Query: "${SEARCH_QUERY}"`);
  console.log(`JSON Parsing: ${USE_JSON_PARSING ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Country: ${COUNTRY}, Language: ${LANGUAGE}`);
  console.log(`Requests: ${NUM_REQUESTS}`);
  console.log(`URL: ${searchUrl}\n`);

  const requests = Array.from({ length: NUM_REQUESTS }, (_, i) => sendRequest(i, searchUrl));
  const results = await Promise.allSettled(requests);

  const successes = results.filter(r => r.status === 'fulfilled').length;
  const failures = results.filter(r => r.status === 'rejected').length;

  console.log(`\nDone! Success: ${successes}/${NUM_REQUESTS} (${((successes / NUM_REQUESTS) * 100).toFixed(0)}%)`);
}

async function sendRequest(requestNumber, searchUrl) {
  try {
    const requestBody = {
      zone: SERP_ZONE,
      url: searchUrl,
      format: "raw"
    };

    const response = await axios.post(API_ENDPOINT, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const extension = USE_JSON_PARSING ? 'json' : 'html';
    const outputPath = `${RESULTS_DIR}/serp_${SEARCH_ENGINE}_${requestNumber}.${extension}`;

    // If JSON parsing is enabled, pretty-print the response
    const content = USE_JSON_PARSING
      ? JSON.stringify(response.data, null, 2)
      : response.data;

    await fs.writeFile(outputPath, content);
    console.log(`[OK] Request ${requestNumber} saved: ${outputPath}`);

  } catch (error) {
    const errorMessage = {
      requestNumber: requestNumber,
      statusCode: error.response?.status || error.code || "API error",
      error: error.message,
      responseData: error.response?.data
    };

    console.error(`[FAIL] Request ${requestNumber} failed: ${errorMessage.statusCode}`);

    const errorPath = `${RESULTS_DIR}/serp_${SEARCH_ENGINE}_failed_${requestNumber}.json`;
    await fs.writeFile(errorPath, JSON.stringify(errorMessage, null, 2));

    throw error;
  }
}

run().catch(console.error);
