import os
import asyncio
from urllib.parse import urlparse
from dotenv import load_dotenv
from playwright.async_api import async_playwright

load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

TARGET_URL = 'https://www.amazon.in/dp/B0CS5XW6TN/'
USE_RESIDENTIAL = False
USE_HEADERS = True
USE_COOKIES = False
BLOCK_REQUESTS = False

ZONE = os.getenv('RESIDENTIAL_ZONE') if USE_RESIDENTIAL else os.getenv('DATACENTER_ZONE')
PASSWORD = os.getenv('RESIDENTIAL_PASSWORD') if USE_RESIDENTIAL else os.getenv('DATACENTER_PASSWORD')
CUSTOMER_ID = os.getenv('BRIGHTDATA_CUSTOMER_ID')
PROXY_HOST = 'brd.superproxy.io:33335'
PROXY_USERNAME = f"brd-customer-{CUSTOMER_ID}-zone-{ZONE}"
PROXY_PASSWORD = PASSWORD

DEFAULT_HEADERS = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
}

COOKIES = {
    'i18n-prefs': 'USD',
    'ubid-main': '132-0756542-7805023',
    'lc-main': 'en_US',
    'session-id': '136-8069771-7581952',
    'session-id-time': '2082787201l',
    'sp-cdn': '"L5Z9:IL"',
    'session-token': 'MlxXDHC9nH8u8deHS2wGd09dgYg2nUWf8YUrCX6V5yU4+lZrBDBOB5uF2N2DuAX/o9UnK42LLztHqhN/wzQ81TyHpD3r1Fv4ZdZJWcJF4GmnHgWYAPCswOjTABmD+Dc8ReiLx5GzYGrmN1orq8h0s8zhkTwlGSShrelswH6iYrWEa3AlGW93ab5/Ml5GNZCs3oFhwR0Wn1fAAL9T+kqSzLZC569rz5f4JOupzYTlq3S9ouxB/b/f2G8PLE42h7jCL9Nq9uCAXi1Yxa7+/mFiMb/gwgp2q4Ptfw0mDczzMav4feWDDAUqSev139lvQu7IZRhu6Es1X1UOTjp6uMHpcgqvtGo/P6Pu',
    'skin': 'noskin',
}


async def run():
    """Main function to run browser with proxy."""
    print('=== Browser with Proxy Demo ===')
    print(f"Proxy: {'RESIDENTIAL' if USE_RESIDENTIAL else 'DATACENTER'} ({ZONE})")
    print(f"Headers: {'ENABLED' if USE_HEADERS else 'DISABLED'}")
    print(f"Cookies: {'ENABLED' if USE_COOKIES else 'DISABLED'}")
    print(f"Block Requests: {'ENABLED' if BLOCK_REQUESTS else 'DISABLED'}\n")

    try:
        async with async_playwright() as p:
            # Launch browser with proxy
            browser = await p.chromium.launch(
                headless=False,
                proxy={
                    'server': f'http://{PROXY_HOST}',
                    'username': PROXY_USERNAME,
                    'password': PROXY_PASSWORD,
                },
                args=['--ignore-certificate-errors']
            )

            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                ignore_https_errors=True
            )

            page = await context.new_page()

            # Set headers if enabled
            if USE_HEADERS:
                await page.set_extra_http_headers(DEFAULT_HEADERS)

            # Set cookies if enabled
            if USE_COOKIES:
                domain = urlparse(TARGET_URL).hostname
                cookies_list = [
                    {'name': name, 'value': value, 'domain': domain, 'path': '/'}
                    for name, value in COOKIES.items()
                ]
                await context.add_cookies(cookies_list)

            # Block requests if enabled
            if BLOCK_REQUESTS:
                async def handle_route(route):
                    if route.request.resource_type in ['image', 'stylesheet', 'font']:
                        await route.abort()
                    else:
                        await route.continue_()

                await page.route('**/*', handle_route)

            print(f"Loading: {TARGET_URL}")
            await page.goto(TARGET_URL, wait_until='domcontentloaded', timeout=60000)
            await page.wait_for_timeout(10000)

            domain = urlparse(TARGET_URL).hostname
            screenshot_path = f"screenshot_{domain}.png"
            await page.screenshot(path=screenshot_path)
            print(f"[OK] Screenshot saved: {screenshot_path}")

            await browser.close()
            print('\nDone!')

    except Exception as error:
        print(f"[FAIL] Error: {error}")


if __name__ == '__main__':
    asyncio.run(run())
