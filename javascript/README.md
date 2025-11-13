# Bright Data Workshop - JavaScript Version

This is the JavaScript implementation of the Bright Data web scraping workshop. Learn how to choose the right scraping solution based on your needs, optimize for cost efficiency, and maximize success rates.

## Prerequisites

- Node.js 18 or higher
- Google Chrome browser installed (for browser-based scripts)
- Bright Data account with active zones:
  - Datacenter Proxy Zone
  - Residential Proxy Zone (optional)
  - Web Unlocker Zone
  - Scraping Browser Zone

---

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Credentials

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Bright Data credentials from the [Dashboard](https://brightdata.com/cp/zones):

```env
BRIGHTDATA_CUSTOMER_ID=hl_xxxxxxxx

DATACENTER_ZONE=datacenter_proxy
DATACENTER_PASSWORD=your_datacenter_password

RESIDENTIAL_ZONE=residential_proxy
RESIDENTIAL_PASSWORD=your_residential_password

WEB_UNLOCKER_ZONE=unlocker
WEB_UNLOCKER_PASSWORD=your_unlocker_password

SCRAPING_BROWSER_ZONE=scraping_browser
SCRAPING_BROWSER_PASSWORD=your_scraping_browser_password
```

---

## Workshop Scripts

### 1. Simple HTTP Request ([simple_request.js](src/simple_request.js))

**What it demonstrates:**
- Basic HTTP requests through proxies using `axios`
- Impact of headers and cookies on success rate
- Baseline for cost-efficient scraping
- Compare Datacenter vs Residential IPs

**Run it:**
```bash
npm run simple
```

**Configuration:**
Edit the script to toggle:
- `USE_RESIDENTIAL` - Switch between Datacenter and Residential proxies
- `USE_HEADERS` - Enable/disable browser-like headers
- `USE_COOKIES` - Enable/disable cookies
- `NUM_REQUESTS` - Number of parallel requests

**Default Configuration:**
- `USE_RESIDENTIAL`: `false` (uses Datacenter proxy)
- `USE_HEADERS`: `false` (disabled - try enabling to see improved success rates!)
- `USE_COOKIES`: `false`
- `NUM_REQUESTS`: `10`

---

### 2. Browser with Proxy ([browser_with_proxy.js](src/browser_with_proxy.js))

**What it demonstrates:**
- Using Puppeteer with Chrome and proxies
- Browser automatically handles JavaScript rendering
- Headers/cookies in browser context
- Request blocking for efficiency

**Run it:**
```bash
npm run browser
```

**Configuration:**
- `USE_RESIDENTIAL` - Switch proxy types
- `USE_REAL_BROWSER` - Use installed Chrome vs Chromium
- `USE_HEADERS` - Custom HTTP headers
- `USE_COOKIES` - Session cookies
- `BLOCK_REQUESTS` - Block images/CSS/fonts

**Default Configuration:**
- `USE_RESIDENTIAL`: `false`
- `USE_REAL_BROWSER`: `true` (uses your installed Chrome)
- `USE_HEADERS`: `true` (enabled by default)
- `USE_COOKIES`: `false`
- `BLOCK_REQUESTS`: `false`

---

### 3. Web Unlocker Demo ([unlocker_demo.js](src/unlocker_demo.js))

**What it demonstrates:**
- Direct comparison: Regular proxy vs Web Unlocker
- Automatic CAPTCHA solving and fingerprinting
- No manual header/cookie configuration needed

**Run it:**
```bash
# Default runs with Web Unlocker enabled
npm run unlocker

# To try with Regular Datacenter Proxy:
# Set USE_WEB_UNLOCKER = false in the script, then run:
npm run unlocker
```

**Default Configuration:**
- `USE_WEB_UNLOCKER`: `true` (Web Unlocker enabled by default)
- `NUM_REQUESTS`: `10`

**Note:** Script now uses `axios` for consistency with other HTTP scripts.

---

### 4. Scraping Browser ([remote_browser.js](src/remote_browser.js))

**What it demonstrates:**
- Remote browser with automatic unique fingerprints
- Connects via WebSocket to Bright Data's hosted browsers
- Automatic CAPTCHA solving
- Chrome DevTools integration

**Run it:**
```bash
npm run remote-browser
```

**Configuration:**
- `USE_SCRAPING_BROWSER` - Toggle between remote and local browser
- `COUNTRY` - Target country for IP geolocation
- `DELAY_BEFORE_CLOSE` - Time to inspect in DevTools

**Default Configuration:**
- `USE_SCRAPING_BROWSER`: `false` (starts in local Chrome mode)
- `COUNTRY`: `'in'` (India)
- `DELAY_BEFORE_CLOSE`: `60000` (60 seconds)

---

## NPM Scripts

Defined in `package.json`:

```json
{
  "scripts": {
    "simple": "node src/simple_request.js",
    "browser": "node src/browser_with_proxy.js",
    "unlocker": "node src/unlocker_demo.js",
    "remote-browser": "node src/remote_browser.js"
  }
}
```

---

## Key JavaScript Libraries Used

### axios
- Popular HTTP client with promise support
- Proxy configuration built-in
- Perfect for simple HTTP scraping

### puppeteer-core
- Browser automation library by Google Chrome team
- Controls Chrome/Chromium via DevTools Protocol
- Excellent for JavaScript-heavy sites

### https-proxy-agent
- HTTPS proxy support for Node.js HTTP clients
- Integrates seamlessly with axios
- Used by all HTTP-based scripts for proxy connections

---

## Troubleshooting

### Error: Cannot find module
```bash
npm install
```

### Error: 407 Proxy Authentication Required
- Check your `BRIGHTDATA_CUSTOMER_ID` in `.env`
- Verify zone names match your Bright Data dashboard
- Ensure passwords are correct (no extra spaces)

### Chrome Not Found
Update the `executablePath` in scripts:
- Windows: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`
- Mac: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Linux: `/usr/bin/google-chrome`

### Connection Timeout
- Check internet connection
- Verify zone is active in Bright Data dashboard
- Try increasing timeout value in script

---

## JavaScript vs Python Comparison

| Feature | JavaScript | Python |
|---------|------------|--------|
| HTTP Library | axios | aiohttp |
| Browser Automation | Puppeteer | Playwright |
| Async Support | async/await | async/await |
| Performance | Fast | Fast |
| Learning Curve | Easy | Easy |

Both implementations follow the same workshop structure and concepts!

---

## Next Steps

1. Start with [simple_request.js](src/simple_request.js) to understand proxy basics
2. Toggle headers/cookies to see their impact
3. Try [browser_with_proxy.js](src/browser_with_proxy.js) for JavaScript-heavy sites
4. Test [unlocker_demo.js](src/unlocker_demo.js) to see Web Unlocker in action
5. Use [remote_browser.js](src/remote_browser.js) for maximum success rates

---

**Happy Scraping with JavaScript! 🚀**

*For conceptual learning and decision frameworks, see the [main README](../README.md)*
