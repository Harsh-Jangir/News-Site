// This is our secure "middleman" function.
// It runs on Netlify's servers, not in the browser.

// We need the 'fetch' capability on the server.
// You will need to install this dependency for your Netlify function.
// In your project's root directory, run: npm init -y
// Then run: npm install node-fetch
const fetch = require('node-fetch');

// The main logic of the function is in 'exports.handler'.
exports.handler = async function (event, context) {
  // Get the secret API key from an environment variable.
  // We will set this up in the Netlify dashboard, NOT in the code.
  const apiKey = process.env.GNEWS_API_KEY;

  // If the API key is not set, return an error immediately.
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key is not configured.' }),
    };
  }

  const apiUrl = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=us&max=10`;

  try {
    // Fetch the news from GNews API.
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Return the news data to our frontend website.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Handle any errors during the fetch.
    console.error('Error fetching news:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news from the provider.' }),
    };
  }
};
