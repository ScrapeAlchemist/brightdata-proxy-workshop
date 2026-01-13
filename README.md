# Bright Data Workshop

Welcome to the Bright Data web scraping workshop! This hands-on workshop demonstrates how to choose the right scraping solution based on your needs, optimize for cost efficiency, and maximize success rates.

**Available in two languages:**

<table>
<tr>
<td width="50%" valign="top">

### 🟨 JavaScript
**[Get Started with JavaScript](javascript/)**

**Best for:**
- Node.js developers
- Quick prototyping
- npm ecosystem

**Requirements:**
- Node.js 18+
- npm

</td>
<td width="50%" valign="top">

### 🐍 Python
**[Get Started with Python](python/)**

**Best for:**
- Python developers
- Data science workflows
- pip ecosystem

**Requirements:**
- Python 3.8+
- pip

</td>
</tr>
</table>

---

## Workshop Learning Objectives

By the end of this workshop, you'll understand:

1. **Cost-Efficient Scraping Strategy** - Start with the cheapest solution and upgrade only when needed
2. **Headers & Cookies Impact** - How adding proper headers/cookies dramatically increases success rates
3. **When to Use What** - Decision framework for choosing between different Bright Data products
4. **Success Rate Optimization** - Practical demonstrations of solving blocks and CAPTCHAs

---

## Prerequisites

- Bright Data account with active zones:
  - Datacenter Proxy Zone
  - Web Unlocker Zone
  - Scraping Browser Zone
  - SERP API Zone
  - Residential Proxy Zone (optional)
- Google Chrome browser installed (for browser-based scripts)
- Your chosen programming language runtime (Node.js or Python)

---

## Understanding Cost & Complexity Trade-offs

### The Cost Efficiency Ladder

```
PROXY OPTIONS (cheapest → more expensive):
├─ Datacenter Proxy + Simple HTTP Request
├─ Datacenter Proxy + Browser
├─ Residential Proxy + Simple HTTP Request
└─ Residential Proxy + Browser

MANAGED SOLUTIONS (No headers/cookies hassle):
├─ Web Unlocker (for simple requests)
├─ SERP API (for search engine results)
└─ Scraping Browser (for dynamic sites)
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

## Important: Default Configurations Vary by Language

For easier demonstration and comparison, some scripts have different default settings between JavaScript and Python:

| Script | Configuration | JavaScript | Python | Why Different? |
|--------|--------------|------------|--------|----------------|
| simple_request | USE_HEADERS | `false` | `False` | Shows impact of adding headers |
| browser_with_proxy | USE_RESIDENTIAL | `false` | `True` | Demonstrates both proxy types |
| unlocker_demo | USE_WEB_UNLOCKER | `true` | `False` | Shows regular vs unlocker comparison |
| remote_browser | USE_SCRAPING_BROWSER | `false` | `False` | Both start in local mode |
| serp_api_demo | USE_JSON_PARSING | `true` | `False` | Shows JSON vs raw HTML output |

These intentional differences let you see varied behaviors by default. Check the language-specific READMEs for complete configuration options.

---

## Workshop Demonstrations

Both JavaScript and Python versions include 5 core demonstrations:

### 1. Simple HTTP Request
**Cost Level:** CHEAPEST (Datacenter) or MODERATE (Residential)

Demonstrates:
- Basic HTTP requests through proxies
- Impact of headers and cookies on success rate
- Baseline for cost-efficient scraping
- Compare Datacenter vs Residential IPs

### 2. Browser with Proxy
**Cost Level:** CHEAP (Datacenter) or MODERATE (Residential)

Demonstrates:
- Using real browser with proxies
- JavaScript rendering handling
- Headers/cookies in browser context
- Request blocking for efficiency

### 3. Web Unlocker Demo
**Cost Level:** HIGHER (but automated)

Demonstrates:
- Direct comparison: Regular proxy vs Web Unlocker
- Automatic CAPTCHA solving
- No manual header/cookie configuration
- Success rate improvement on protected sites

### 4. Scraping Browser
**Cost Level:** HIGHEST (but maximum success)

Demonstrates:
- Remote browser with automatic fingerprints
- WebSocket connection to hosted browsers
- Automatic CAPTCHA solving
- Chrome DevTools integration
- Scalable to hundreds of parallel sessions

### 5. SERP API Demo
**Cost Level:** MODERATE (managed, pay-per-success)

Demonstrates:
- Search engine scraping (Google, Bing, DuckDuckGo)
- Automatic JSON parsing with `brd_json=1`
- Country and language targeting
- No manual header/cookie configuration
- 99.9% success rate on search results

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

## Getting Started

### Choose Your Language:

**JavaScript Developers:**
```bash
cd javascript
npm install
cp .env.example .env
# Edit .env with your credentials
npm run simple
```

**Python Developers:**
```bash
cd python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
cp .env.example .env
# Edit .env with your credentials
python src/simple_request.py
```

---

## Repository Structure

```
.
├── javascript/                   # JavaScript implementation
│   ├── src/
│   │   ├── simple_request.js
│   │   ├── browser_with_proxy.js
│   │   ├── unlocker_demo.js
│   │   ├── remote_browser.js
│   │   ├── serp_api_demo.js
│   │   └── open_chrome.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── python/                       # Python implementation
│   ├── src/
│   │   ├── simple_request.py
│   │   ├── browser_with_proxy.py
│   │   ├── unlocker_demo.py
│   │   ├── remote_browser.py
│   │   ├── serp_api_demo.py
│   │   └── open_chrome.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── .gitignore
└── README.md                     # This file
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

## Troubleshooting

### Error: 407 Proxy Authentication Required
- Check your `BRIGHTDATA_CUSTOMER_ID` and passwords in `.env`
- Verify zone names are correct (case-sensitive)
- Ensure zones are active in Bright Data dashboard

### Getting Blocked Even with Headers/Cookies
- Consider upgrading to Web Unlocker (for HTTP) or Scraping Browser (for browser)
- Check if site requires Residential IPs (geo-restrictions)
- Reduce request rate (may be rate-limited)

### Chrome/Browser Not Found
- Install Google Chrome browser
- Update browser path in scripts if non-standard location

### Connection Timeout
- Check internet connection
- Verify zone is active in Bright Data dashboard
- Try increasing timeout value in script

---

## Additional Resources

- [Bright Data Documentation](https://docs.brightdata.com/)
- [Web Unlocker Features](https://docs.brightdata.com/scraping-automation/web-unlocker/features)
- [SERP API Guide](https://docs.brightdata.com/scraping-automation/serp-api/)
- [Scraping Browser Guide](https://docs.brightdata.com/scraping-automation/scraping-browser/)
- [Pricing](https://brightdata.com/pricing)

---

## Language-Specific Documentation

- **[JavaScript Setup & Scripts →](javascript/README.md)**
- **[Python Setup & Scripts →](python/README.md)**

---

**Happy Scraping! 🚀**

*Remember: Start cheap, optimize headers/cookies, upgrade only when blocked!*
