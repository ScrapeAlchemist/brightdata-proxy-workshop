const { exec } = require('child_process');
const E = exports;

// Function to open Chrome with a specific URL
 E.open_chrome_with_url = (session_id) => {
  // Replace 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' with the full path to the Chrome executable on your system
  const chromePath = '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"';
  const base_url = "https://cdn.brightdata.com/static/devtools/inspector.html?wss=zproxy.lum-superproxy.io%3A9223%2F"
  // Construct the command with the Chrome path and URL
  const command = `${chromePath} ${base_url}${session_id}`;

  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening Chrome: ${error}`);
      return;
    }

    // Chrome has been successfully opened
    console.log('Chrome opened successfully!');
  });
}
