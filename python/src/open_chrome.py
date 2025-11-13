import subprocess
import platform


def open_chrome_with_url(session_id):
    """Open Chrome with a specific DevTools URL."""
    # Determine Chrome path based on operating system
    system = platform.system()

    if system == 'Windows':
        chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    elif system == 'Darwin':  # macOS
        chrome_path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    else:  # Linux
        chrome_path = 'google-chrome'

    base_url = "https://cdn.brightdata.com/static/devtools/inspector.html?wss=zproxy.lum-superproxy.io%3A9223%2F"
    full_url = f"{base_url}{session_id}"

    try:
        # Execute the command to open Chrome
        subprocess.Popen([chrome_path, full_url],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL)
        print('Chrome opened successfully!')
    except Exception as error:
        print(f"Error opening Chrome: {error}")


async def open_chrome_with_cdp(cdp_session):
    """Open Chrome DevTools using CDP session."""
    try:
        # First, get the frame tree to retrieve the main frame ID
        frame_tree = await cdp_session.send('Page.getFrameTree')
        frame_id = frame_tree['frameTree']['frame']['id']

        print(f'Frame ID: {frame_id}')

        # Now call Page.inspect with the actual frame ID
        result = await cdp_session.send('Page.inspect', {'frameId': frame_id})
        inspect_url = result.get('url', '')

        if inspect_url and '9223/' in inspect_url:
            session_id = inspect_url.split('9223/')[1]
            print(f'DevTools ID: {session_id}')
            open_chrome_with_url(session_id)
        else:
            print(f"Invalid inspect URL received: {inspect_url}")
    except Exception as e:
        print(f"Could not open DevTools: {e}")
        import traceback
        traceback.print_exc()
