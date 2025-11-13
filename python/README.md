# Bright Data Workshop - Python Version

This is the Python implementation of the Bright Data web scraping workshop. Learn how to choose the right scraping solution based on your needs, optimize for cost efficiency, and maximize success rates.

## Prerequisites

- Python 3.8 or higher
- Google Chrome browser installed (for browser-based scripts)
- Bright Data account with active zones:
  - Datacenter Proxy Zone
  - Residential Proxy Zone (optional)
  - Web Unlocker Zone
  - Scraping Browser Zone

---

## Quick Setup

### 1. Create Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium
```

### 3. Configure Credentials

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

### 1. Simple HTTP Request ([simple_request.py](src/simple_request.py))

**What it demonstrates:**
- Basic HTTP requests through proxies using `aiohttp`
- Impact of headers and cookies on success rate
- Async requests for better performance
- Compare Datacenter vs Residential IPs

**Run it:**
```bash
python src/simple_request.py
```

**Configuration:**
Edit the script to toggle:
- `USE_RESIDENTIAL` - Switch between Datacenter and Residential proxies
- `USE_HEADERS` - Enable/disable browser-like headers
- `USE_COOKIES` - Enable/disable cookies
- `NUM_REQUESTS` - Number of parallel requests

**Default Configuration:**
- `USE_RESIDENTIAL`: `False` (uses Datacenter proxy)
- `USE_HEADERS`: `False` (disabled - try enabling to see improved success rates!)
- `USE_COOKIES`: `False`
- `NUM_REQUESTS`: `10`

---

### 2. Browser with Proxy ([browser_with_proxy.py](src/browser_with_proxy.py))

**What it demonstrates:**
- Using Playwright with Chrome and proxies
- Browser automatically handles JavaScript rendering
- Headers/cookies in browser context
- Request blocking for efficiency

**Run it:**
```bash
python src/browser_with_proxy.py
```

**Configuration:**
- `USE_RESIDENTIAL` - Switch proxy types
- `USE_HEADERS` - Custom HTTP headers
- `USE_COOKIES` - Session cookies
- `BLOCK_REQUESTS` - Block images/CSS/fonts

**Default Configuration:**
- `USE_RESIDENTIAL`: `True` (uses Residential proxy by default)
- `USE_HEADERS`: `True` (enabled by default)
- `USE_COOKIES`: `False`
- `BLOCK_REQUESTS`: `False`

**Note:** Python version uses Playwright which always manages the browser instance.

---

### 3. Web Unlocker Demo ([unlocker_demo.py](src/unlocker_demo.py))

**What it demonstrates:**
- Direct comparison: Regular proxy vs Web Unlocker
- Automatic CAPTCHA solving and fingerprinting
- No manual header/cookie configuration needed

**Run it:**
```bash
# Default runs with Regular Datacenter Proxy
python src/unlocker_demo.py

# To try with Web Unlocker:
# Set USE_WEB_UNLOCKER = True in the script, then run:
python src/unlocker_demo.py
```

**Default Configuration:**
- `USE_WEB_UNLOCKER`: `False` (Datacenter proxy by default)
- `NUM_REQUESTS`: `10`

**Note:** Default is `False` (different from JavaScript version which defaults to `True`).

---

### 4. Scraping Browser ([remote_browser.py](src/remote_browser.py))

**What it demonstrates:**
- Remote browser with automatic unique fingerprints
- Connects via CDP to Bright Data's hosted browsers
- Automatic CAPTCHA solving
- Chrome DevTools integration

**Run it:**
```bash
python src/remote_browser.py
```

**Configuration:**
- `USE_SCRAPING_BROWSER` - Toggle between remote and local browser
- `COUNTRY` - Target country for IP geolocation
- `DELAY_BEFORE_CLOSE` - Time to inspect in DevTools

**Default Configuration:**
- `USE_SCRAPING_BROWSER`: `False` (starts in local mode)
- `COUNTRY`: `'in'` (India)
- `DELAY_BEFORE_CLOSE`: `60000` (60 seconds)

**Note:** Default is `False` (different from JavaScript version's behavior).

---

## Key Python Libraries Used

### aiohttp
- Async HTTP client for fast, concurrent requests
- SSL/TLS support with proxy configuration
- Perfect for simple HTTP scraping

### Playwright
- Modern browser automation library
- Supports Chromium, Firefox, and WebKit
- Native async/await support
- Better performance than Selenium

### python-dotenv
- Load environment variables from .env files
- Keep credentials secure

---

## Troubleshooting

### ImportError: No module named 'playwright'
```bash
pip install -r requirements.txt
playwright install chromium
```

### SSL Certificate Errors
The scripts disable SSL verification for development. For production:
```python
# Remove these lines:
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE
```

### Chrome Not Found
Update the Chrome path in scripts:
- Windows: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`
- Mac: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Linux: `/usr/bin/google-chrome` or `google-chrome`

### Proxy Authentication Failed
- Check your `BRIGHTDATA_CUSTOMER_ID` in `.env`
- Verify zone names match your Bright Data dashboard
- Ensure passwords are correct (no extra spaces)

---

## Python vs JavaScript Comparison

| Feature | Python | JavaScript |
|---------|--------|------------|
| HTTP Library | aiohttp | axios |
| Browser Automation | Playwright | Puppeteer |
| Async Support | async/await | async/await |
| Performance | Fast (async) | Fast (async) |
| Learning Curve | Easy | Easy |

Both implementations follow the same workshop structure and concepts!

---

## Next Steps

1. Start with [simple_request.py](src/simple_request.py) to understand proxy basics
2. Toggle headers/cookies to see their impact
3. Try [browser_with_proxy.py](src/browser_with_proxy.py) for JavaScript-heavy sites
4. Test [unlocker_demo.py](src/unlocker_demo.py) to see Web Unlocker in action
5. Use [remote_browser.py](src/remote_browser.py) for maximum success rates

---

**Happy Scraping with Python! 🐍**

*For conceptual learning and decision frameworks, see the [main README](../README.md)*
