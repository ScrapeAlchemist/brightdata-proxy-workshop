import os
import asyncio
import json
from urllib.parse import urlparse
from dotenv import load_dotenv
import aiohttp
import ssl

load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

TARGET_URL = "https://www.flipkart.com/dell-se-series-55-88-cm-22-inch-full-hd-led-backlit-va-panel-contrast-3000-1-tilt-adjustment-1x-hdmi-1xvga-3-years-warranty-tuv-rheinland-3-star-eye-comfort-ultra-thin-bezel-monitor-se2225hm/p/itm928c341bee303"
USE_WEB_UNLOCKER = False
NUM_REQUESTS = 10
RESULTS_DIR = './results'

CUSTOMER_ID = os.getenv('BRIGHTDATA_CUSTOMER_ID')
PROXY_DC = f"http://brd-customer-{CUSTOMER_ID}-zone-{os.getenv('DATACENTER_ZONE')}:{os.getenv('DATACENTER_PASSWORD')}@brd.superproxy.io:33335"
PROXY_UNLOCKER = f"http://brd-customer-{CUSTOMER_ID}-zone-{os.getenv('WEB_UNLOCKER_ZONE')}:{os.getenv('WEB_UNLOCKER_PASSWORD')}@brd.superproxy.io:33335"

proxy = PROXY_UNLOCKER if USE_WEB_UNLOCKER else PROXY_DC

# ============================================================================
# MAIN
# ============================================================================

num_of_fails = 0


async def send_request(session, request_number, proxy):
    """Send a single request through the proxy."""
    global num_of_fails
    domain = urlparse(TARGET_URL).hostname

    try:
        async with session.get(TARGET_URL, proxy=proxy, timeout=aiohttp.ClientTimeout(total=30)) as response:
            html = await response.text()
            output_path = f"{RESULTS_DIR}/{domain}_{request_number}.html"

            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html)

            print(f"[OK] Request {request_number} saved: {output_path}")

    except Exception as err:
        num_of_fails += 1
        status_code = getattr(err, 'status', 'Proxy/Script error')

        error_message = {
            "statusCode": status_code,
            "requestNumber": request_number,
            "error": str(err),
        }

        print(f"[FAIL] Request {request_number} failed: {status_code}")

        error_path = f"{RESULTS_DIR}/{domain}_failed_{request_number}.json"
        with open(error_path, 'w', encoding='utf-8') as f:
            json.dump(error_message, f, indent=2)


async def run():
    """Main function to run multiple requests."""
    os.makedirs(RESULTS_DIR, exist_ok=True)

    print('=== Web Unlocker Demo ===')
    print(f"Proxy: {'WEB UNLOCKER' if USE_WEB_UNLOCKER else 'DATACENTER'}")
    print(f"URL: {TARGET_URL}")
    print(f"Requests: {NUM_REQUESTS}\n")

    # Create SSL context that doesn't verify certificates (for development)
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    connector = aiohttp.TCPConnector(ssl=ssl_context)

    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [send_request(session, i, proxy) for i in range(NUM_REQUESTS)]
        await asyncio.gather(*tasks)

    success = NUM_REQUESTS - num_of_fails
    success_rate = (success / NUM_REQUESTS) * 100
    print(f"\nDone! Success: {success}/{NUM_REQUESTS} ({success_rate:.0f}%)")


if __name__ == '__main__':
    asyncio.run(run())
