import os
import asyncio
import json
from dotenv import load_dotenv
import aiohttp

load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

SEARCH_QUERY = "web scraping tutorial"
SEARCH_ENGINE = "google"  # "google" | "bing" | "duckduckgo"
USE_JSON_PARSING = False  # Toggle for brd_json=1 (structured JSON output)
COUNTRY = "us"            # For Google: gl parameter
LANGUAGE = "en"           # For Google: hl parameter
NUM_REQUESTS = 5
RESULTS_DIR = './results'

# API Configuration
API_ENDPOINT = "https://api.brightdata.com/request"
API_TOKEN = os.getenv('SERP_API_TOKEN')
SERP_ZONE = os.getenv('SERP_API_ZONE', 'serp')

# ============================================================================
# SEARCH ENGINE URL BUILDER
# ============================================================================


def build_search_url(query, engine, country, language, use_json):
    """Build search URL for the specified engine."""
    from urllib.parse import quote
    encoded_query = quote(query)
    json_param = '&brd_json=1' if use_json else ''

    engine = engine.lower()
    if engine == 'google':
        return f"https://www.google.com/search?q={encoded_query}&gl={country}&hl={language}{json_param}"
    elif engine == 'bing':
        return f"https://www.bing.com/search?q={encoded_query}{json_param}"
    elif engine == 'duckduckgo':
        return f"https://duckduckgo.com/?q={encoded_query}{json_param}"
    else:
        raise ValueError(f"Unsupported search engine: {engine}")


# ============================================================================
# MAIN
# ============================================================================

num_of_fails = 0


async def send_request(session, request_number, search_url):
    """Send a single request to the SERP API."""
    global num_of_fails

    try:
        request_body = {
            "zone": SERP_ZONE,
            "url": search_url,
            "format": "raw"
        }

        headers = {
            'Authorization': f'Bearer {API_TOKEN}',
            'Content-Type': 'application/json'
        }

        async with session.post(
            API_ENDPOINT,
            json=request_body,
            headers=headers,
            timeout=aiohttp.ClientTimeout(total=30)
        ) as response:
            data = await response.text()

            extension = 'json' if USE_JSON_PARSING else 'html'
            output_path = f"{RESULTS_DIR}/serp_{SEARCH_ENGINE}_{request_number}.{extension}"

            # If JSON parsing is enabled, pretty-print the response
            if USE_JSON_PARSING:
                try:
                    parsed = json.loads(data)
                    content = json.dumps(parsed, indent=2)
                except json.JSONDecodeError:
                    content = data
            else:
                content = data

            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"[OK] Request {request_number} saved: {output_path}")

    except Exception as err:
        num_of_fails += 1
        status_code = getattr(err, 'status', 'API error')

        error_message = {
            "requestNumber": request_number,
            "statusCode": str(status_code),
            "error": str(err),
        }

        print(f"[FAIL] Request {request_number} failed: {status_code}")

        error_path = f"{RESULTS_DIR}/serp_{SEARCH_ENGINE}_failed_{request_number}.json"
        with open(error_path, 'w', encoding='utf-8') as f:
            json.dump(error_message, f, indent=2)


async def run():
    """Main function to run multiple requests."""
    if not API_TOKEN:
        print('Error: SERP_API_TOKEN not found in environment variables.')
        print('Please add your API token to the .env file.')
        return

    os.makedirs(RESULTS_DIR, exist_ok=True)

    search_url = build_search_url(SEARCH_QUERY, SEARCH_ENGINE, COUNTRY, LANGUAGE, USE_JSON_PARSING)

    print('=== SERP API Demo ===')
    print(f"Search Engine: {SEARCH_ENGINE.upper()}")
    print(f'Query: "{SEARCH_QUERY}"')
    print(f"JSON Parsing: {'ENABLED' if USE_JSON_PARSING else 'DISABLED'}")
    print(f"Country: {COUNTRY}, Language: {LANGUAGE}")
    print(f"Requests: {NUM_REQUESTS}")
    print(f"URL: {search_url}\n")

    async with aiohttp.ClientSession() as session:
        tasks = [send_request(session, i, search_url) for i in range(NUM_REQUESTS)]
        await asyncio.gather(*tasks)

    success = NUM_REQUESTS - num_of_fails
    success_rate = (success / NUM_REQUESTS) * 100
    print(f"\nDone! Success: {success}/{NUM_REQUESTS} ({success_rate:.0f}%)")


if __name__ == '__main__':
    asyncio.run(run())
