# Bright Data Workshop

Welcome to the Bright Data web scraping workshop! This hands-on workshop demonstrates how to choose the right scraping solution based on your needs, optimize for cost efficiency, and maximize success rates.

## Workshop Learning Objectives

By the end of this workshop, you'll understand:

1. **Cost-Efficient Scraping Strategy** - Start with the cheapest solution and upgrade only when needed
2. **Headers & Cookies Impact** - How adding proper headers/cookies dramatically increases success rates
3. **When to Use What** - Decision framework for choosing between different Bright Data products
4. **Success Rate Optimization** - Practical demonstrations of solving blocks and CAPTCHAs

---

## Prerequisites

- Node.js 18 or higher
- Google Chrome browser installed
- Bright Data account with active zones:
  - Datacenter Proxy Zone
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

### 3. Create Output Directories

```bash
mkdir results sbr_results
```

---

## Understanding Cost & Complexity Trade-offs

### The Cost Efficiency Ladder

```
PROXY OPTIONS (cheapest → more expensive):
├─ Datacenter Proxy + Simple HTTP Request     [simple_request.js]
├─ Datacenter Proxy + Browser                 [browser_with_proxy.js]
├─ Residential Proxy + Simple HTTP Request    [simple_request.js - swap zone]
└─ Residential Proxy + Browser                [browser_with_proxy.js - swap zone]

MANAGED SOLUTIONS (No headers/cookies hassle):
├─ Web Unlocker (for simple requests)         [unlocker_demo.js]
└─ Scraping Browser (for dynamic sites)       [remote_browser.js]
```

### Decision Framework

**Start Here:**
1. Try Datacenter Proxy with simple HTTP requests
2. Add headers and cookies to improve success rate
3. If still blocked → Choose your upgrade path:

**Upgrade Path A: Stick with HTTP**
- If blocked → Use **Web Unlocker** (handles headers/cookies/CAPTCHAs automatically)

**Upgrade Path B: Need a Browser**
- If need JavaScript rendering → Use Datacenter + Browser
- If blocked → Use **Scraping Browser** (remote browser with auto-fingerprinting & CAPTCHA solving)

---

## Workshop Scripts

### 1. Simple HTTP Request ([simple_request.js](src/simple_request.js))

**💰 Cost Level:** CHEAPEST (Datacenter) or MODERATE (Residential)

**What it demonstrates:**
- Basic HTTP requests through proxies (Datacenter or Residential)
- Impact of headers and cookies on success rate
- Baseline for cost-efficient scraping
- Compare Datacenter vs Residential IPs by swapping zones

**Success Rate Demo:**
1. Run with `USE_HEADERS = false` and `USE_COOKIES = false` → High block rate
2. Enable `USE_COOKIES = true` → Better success rate
3. Enable both `USE_HEADERS = true` and `USE_COOKIES = true` → Best success rate
4. Switch `USE_RESIDENTIAL = true` in the script → See impact of Residential IPs on success rate

**Run it:**
```bash
npm run simple
```

**Key Takeaways:**
- Cheapest option for high-volume scraping (Datacenter)
- Adding proper headers/cookies dramatically improves success
- Easy switch between Datacenter and Residential with `USE_RESIDENTIAL` flag
- Works great for public data and sites without heavy bot protection
- When this fails → upgrade to Web Unlocker

---

### 2. Browser with Proxy ([browser_with_proxy.js](src/browser_with_proxy.js))

**💰 Cost Level:** CHEAP (Datacenter) or MODERATE (Residential)

**What it demonstrates:**
- Using real Chrome browser with proxies (Datacenter or Residential)
- Browser automatically handles JavaScript rendering
- Headers/cookies impact in browser context
- Request blocking for efficiency
- Compare Datacenter vs Residential by swapping zones

**Success Rate Demo:**
1. Run with `USE_HEADERS = false` and `USE_COOKIES = false` → May get blocked
2. Enable `USE_HEADERS = true` → Better browser fingerprint
3. Enable `USE_COOKIES = true` → Maintains session state
4. Switch `USE_RESIDENTIAL = true` in the script → See impact of Residential IPs on success rate

**Run it:**
```bash
npm run browser
```

**Key Takeaways:**
- Use when target site requires JavaScript rendering
- Cost-effective with Datacenter, higher success with Residential
- Real browser = more realistic fingerprint than HTTP
- Can test both proxy types by changing zone in `.env`
- When this fails → upgrade to Scraping Browser

---

### 3. Web Unlocker Demo ([unlocker_demo.js](src/unlocker_demo.js))

**What it demonstrates:**
- Direct comparison: Regular proxy vs Web Unlocker
- How Web Unlocker automatically handles blocks and CAPTCHAs
- No need to manually configure headers or cookies
- Success rate improvement on protected sites

**Success Rate Demo:**
1. Run with `WU = false` (Regular Proxy) → High failure rate on ah.nl
2. Run with `WU = true` (Web Unlocker) → High success rate, no blocks
3. Compare results in `results/` folder
4. Check `results/test--failed*.json` for error details

**Run it:**
```bash
# First try with Regular Proxy (WU = false)
npm run unlocker

# Then change WU = true in the file and run again
npm run unlocker
```

**Key Takeaways:**
- Web Unlocker automatically solves CAPTCHAs and handles fingerprinting
- No need to manage headers, cookies, or retries yourself
- Higher success rate on protected e-commerce and social media sites
- Use when regular proxies (DC or Residential) are getting blocked
- Still uses simple HTTP requests (not a browser)

---

### 4. Scraping Browser ([remote_browser.js](src/remote_browser.js))

**What it demonstrates:**
- Remote browser with automatic unique fingerprints
- Connects via WebSocket to Bright Data's hosted browsers
- Automatic CAPTCHA solving when encountered
- Chrome DevTools integration for debugging
- Can scale to multiple parallel browser sessions

**Success Rate Demo:**
1. Try connecting to Lazada with local browser + regular proxy → May get blocked/CAPTCHA
2. Switch `useSB = true` (Scraping Browser) → Automatic success
3. Each session gets a unique fingerprint and IP
4. CAPTCHAs are solved automatically in the background

**Run it:**
```bash
npm run remote-browser
```

**Key Takeaways:**
- Use for JavaScript-heavy sites that require browser interaction
- Automatic fingerprint generation (no manual configuration)
- Built-in CAPTCHA solving
- Can run hundreds of parallel browser sessions
- Real-time debugging with Chrome DevTools
- Use when regular browser + proxy fails or you need to interact with dynamic content

---

## Key Workshop Insights

### 1. Headers & Cookies Matter

Adding proper headers and cookies can increase success rates from 20% to 80%+ with Datacenter proxies:

- **Without:** Gets blocked as "bot-like" traffic
- **With Headers:** Mimics real browser requests
- **With Cookies:** Maintains session state and authentication

### 2. Start Cheap, Upgrade When Needed

Don't pay for Residential IPs or managed solutions if Datacenter + headers works:

```
Always start with: DC + HTTP + Headers/Cookies
↓ (if blocked)
Upgrade to: Web Unlocker (for HTTP) or DC + Browser (for JS)
↓ (if still blocked)
Final solution: Scraping Browser (for maximum success)
```

### 3. Managed Solutions = Less Hassle

Web Unlocker and Scraping Browser handle the complexity for you:

- No manual header configuration
- No cookie management
- Automatic CAPTCHA solving
- Automatic retries and fingerprinting
- Higher cost but faster development time

### 4. Choose HTTP vs Browser Based on Site

**Use HTTP (cheaper) when:**
- Site returns full HTML in initial response
- No JavaScript rendering required
- APIs and server-side rendered pages

**Use Browser when:**
- Content loaded via JavaScript
- Need to interact with site (click, scroll, fill forms)
- Infinite scroll or AJAX-loaded content
- SPAs (Single Page Applications)

---

## Troubleshooting

### Error: 407 Proxy Authentication Required
- Check your `BRIGHTDATA_CUSTOMER_ID` and `BRIGHTDATA_PASSWORD` in `.env`
- Verify zone names are correct (case-sensitive)
- Ensure zones are active in Bright Data dashboard

### Getting Blocked Even with Headers/Cookies
- Consider upgrading to Web Unlocker (for HTTP) or Scraping Browser (for browser)
- Check if site requires Residential IPs (geo-restrictions)
- Reduce request rate (may be rate-limited)

### Chrome Not Found (browser_with_proxy.js)
- Install Google Chrome browser
- Update `CHROME_PATH` in the script if non-standard location
  - Windows: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`
  - Mac: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
  - Linux: `/usr/bin/google-chrome`

### Connection Timeout
- Check internet connection
- Verify zone is active in Bright Data dashboard
- Try increasing timeout value in script

---

## Workshop Files Structure

```
.
├── src/
│   ├── simple_request.js         # Demo 1: Simple HTTP (headers/cookies impact)
│   ├── browser_with_proxy.js     # Demo 2: Browser + Proxy (headers/cookies in browser)
│   ├── unlocker_demo.js          # Demo 3: Web Unlocker comparison
│   ├── remote_browser.js         # Demo 4: Scraping Browser (auto-fingerprint + CAPTCHA)
│   └── open_chrome.js            # Helper: Chrome DevTools integration
├── results/                      # HTTP scraping outputs
├── sbr_results/                  # Scraping Browser outputs
├── .env.example                  # Credentials template
├── .env                          # Your credentials (git-ignored)
├── package.json                  # Dependencies & scripts
└── README.md                     # This guide
```

---

## Best Practices from This Workshop

1. **Always start with the cheapest solution** - Datacenter + Simple HTTP
2. **Add headers and cookies first** - Often solves 80% of blocking issues
3. **Test both Datacenter and Residential** - Swap zones to see which works best
4. **Use Web Unlocker when you don't want to manage headers/cookies** - Let Bright Data handle it
5. **Use browsers only when necessary** - HTTP is faster and cheaper
6. **Monitor your success rates** - Upgrade only when current solution fails
7. **Never hardcode credentials** - Always use `.env` files
8. **Test with small batches first** - Start with 1-5 requests before scaling

---

## Additional Resources

- [Bright Data Documentation](https://docs.brightdata.com/)
- [Web Unlocker Features](https://docs.brightdata.com/scraping-automation/web-unlocker/features)
- [Scraping Browser Guide](https://docs.brightdata.com/scraping-automation/scraping-browser/)
- [Pricing](https://brightdata.com/pricing)

---

**Happy Scraping! 🚀**

*Remember: Start cheap, optimize headers/cookies, upgrade only when blocked!*