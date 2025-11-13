import os
import asyncio
from dotenv import load_dotenv
from playwright.async_api import async_playwright
from open_chrome import open_chrome_with_cdp

load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

TARGET_URL = 'https://www.meesho.com/ubon-type-c-tc-186-wired-earphones-wired-gaming-headset-black-in-the-ear/p/8nymhw'
COUNTRY = 'in'
DELAY_BEFORE_CLOSE = 60000
USE_SCRAPING_BROWSER = True

CUSTOMER_ID = os.getenv('BRIGHTDATA_CUSTOMER_ID')
SCRAPING_BROWSER_ZONE = os.getenv('SCRAPING_BROWSER_ZONE')
SCRAPING_BROWSER_PASSWORD = os.getenv('SCRAPING_BROWSER_PASSWORD')

auth = f"brd-customer-{CUSTOMER_ID}-zone-{SCRAPING_BROWSER_ZONE}-country-{COUNTRY}:{SCRAPING_BROWSER_PASSWORD}"


async def run():
    """Main function to run remote browser scraping."""
    results_dir = 'sbr_results'
    os.makedirs(results_dir, exist_ok=True)

    print('=== Scraping Browser Demo ===')
    print(f"Mode: {'REMOTE SCRAPING BROWSER' if USE_SCRAPING_BROWSER else 'LOCAL CHROME'}")
    print(f"Country: {COUNTRY}")
    print(f"URL: {TARGET_URL}\n")

    try:
        async with async_playwright() as p:
            if USE_SCRAPING_BROWSER:
                # Connect to remote Scraping Browser
                browser = await p.chromium.connect_over_cdp(
                    f"wss://{auth}@zproxy.lum-superproxy.io:9222"
                )
                print('[OK] Connected to remote Scraping Browser')
            else:
                # Use local Chrome
                browser = await p.chromium.launch(headless=False)
                print('[OK] Launched local Chrome browser')

            # Get the default context and page
            if USE_SCRAPING_BROWSER:
                contexts = browser.contexts
                if contexts:
                    context = contexts[0]
                    page = await context.new_page()
                else:
                    page = await browser.new_page()
            else:
                page = await browser.new_page()

            # Open DevTools for remote browser
            if USE_SCRAPING_BROWSER:
                # Get CDP session for DevTools
                cdp = await page.context.new_cdp_session(page)
                await open_chrome_with_cdp(cdp)

            print('Loading page...')
            await page.goto(TARGET_URL, wait_until='domcontentloaded', timeout=60000)

            print('Waiting for network idle...')
            await page.wait_for_load_state('networkidle', timeout=30000)
            print('[OK] Page loaded')

            await page.screenshot(path='./sbr_results/screen.jpg')
            print('[OK] Screenshot saved: ./sbr_results/screen.jpg')

            html = await page.content()
            with open('./sbr_results/data.html', 'w', encoding='utf-8') as f:
                f.write(html)
            print('[OK] HTML saved: ./sbr_results/data.html')

            print(f"\nWaiting {DELAY_BEFORE_CLOSE / 1000:.0f}s before closing (inspect in DevTools if needed)...")
            await asyncio.sleep(DELAY_BEFORE_CLOSE / 1000)

            await browser.close()
            print('Done!')

    except Exception as e:
        print(f"[FAIL] Error: {e}")


if __name__ == '__main__':
    asyncio.run(run())
