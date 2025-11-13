import os
import asyncio
from urllib.parse import urlparse
from dotenv import load_dotenv
import aiohttp
import ssl

load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

TARGET_URL = 'https://www.amazon.in/dp/B0CS5XW6TN/'
USE_RESIDENTIAL = False
USE_HEADERS = True
USE_COOKIES = False
NUM_REQUESTS = 10

ZONE = os.getenv('RESIDENTIAL_ZONE') if USE_RESIDENTIAL else os.getenv('DATACENTER_ZONE')
PASSWORD = os.getenv('RESIDENTIAL_PASSWORD') if USE_RESIDENTIAL else os.getenv('DATACENTER_PASSWORD')
CUSTOMER_ID = os.getenv('BRIGHTDATA_CUSTOMER_ID')
PROXY = f"http://brd-customer-{CUSTOMER_ID}-zone-{ZONE}:{PASSWORD}@brd.superproxy.io:33335"

DEFAULT_HEADERS = {
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
}

COOKIES = {
    'csm-sid': '274-2166109-9384747',
    'x-amz-captcha-1': '1762968865593975',
    'x-amz-captcha-2': '0QFJhpDg65cN3m7Tzzy3Eg==',
}


async def send_request(session, request_number, proxy):
    """Send a single HTTP request through the proxy."""
    try:
        headers = {}
        if USE_HEADERS:
            headers = DEFAULT_HEADERS.copy()

        if USE_COOKIES:
            cookie_str = '; '.join([f"{key}={value}" for key, value in COOKIES.items()])
            headers['Cookie'] = cookie_str

        async with session.get(TARGET_URL, headers=headers, proxy=proxy, timeout=aiohttp.ClientTimeout(total=30)) as response:
            html = await response.text()
            domain = urlparse(TARGET_URL).hostname
            output_path = f"results/{domain}_{request_number}.html"

            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html)

            print(f"[OK] Request {request_number} saved: {output_path}")

    except Exception as error:
        print(f"[FAIL] Request {request_number} failed: {error}")


async def run():
    """Main function to run multiple requests."""
    results_dir = 'results'
    os.makedirs(results_dir, exist_ok=True)

    print('=== Simple HTTP Request Demo ===')
    print(f"Proxy: {'RESIDENTIAL' if USE_RESIDENTIAL else 'DATACENTER'} ({ZONE})")
    print(f"Headers: {'ENABLED' if USE_HEADERS else 'DISABLED'}")
    print(f"Cookies: {'ENABLED' if USE_COOKIES else 'DISABLED'}")
    print(f"Requests: {NUM_REQUESTS}\n")

    # Create SSL context that doesn't verify certificates (for development)
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    connector = aiohttp.TCPConnector(ssl=ssl_context)

    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [send_request(session, i + 1, PROXY) for i in range(NUM_REQUESTS)]
        await asyncio.gather(*tasks)

    print('\nDone! Check the results folder for outputs.')


if __name__ == '__main__':
    asyncio.run(run())
