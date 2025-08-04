const reelsContainer = document.getElementById('reels-container');
const loader = document.getElementById('loader');

// The API URL now points to our secure Netlify function.
const apiUrl = '/.netlify/functions/fetch-news';

// Function to fetch news from our secure function
async function getNews() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the server function returned an error
        if (data.error) {
             throw new Error(data.error);
        }

        loader.style.display = 'none'; // Hide loader after fetching
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        loader.innerHTML = '<p class="text-red-500">Failed to load news. Please check your API key setup in Netlify and try again.</p>';
    }
}

// Function to display the news articles in the reels container
function displayNews(articles) {
    if (!articles || articles.length === 0) {
        loader.style.display = 'flex';
        loader.innerHTML = '<p class="text-yellow-400">No news articles were found. The API might be temporarily down.</p>';
        return;
    }

    articles.forEach(article => {
        // We'll skip articles that don't have an image for a better visual experience
        if (!article.image) {
            return;
        }

        const reel = document.createElement('div');
        reel.className = 'reel';
        reel.style.backgroundImage = `url(${article.image})`;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const content = document.createElement('div');
        content.className = 'relative z-10 p-6 md:p-12 text-white max-w-2xl';

        const title = document.createElement('h1');
        title.className = 'text-3xl md:text-5xl font-bold mb-4';
        title.textContent = article.title;

        const description = document.createElement('p');
        description.className = 'text-base md:text-lg mb-6';
        description.textContent = article.description;

        const sourceLink = document.createElement('a');
        sourceLink.className = 'inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300';
        sourceLink.href = article.url;
        sourceLink.textContent = `Read Full Story at ${article.source.name}`;
        sourceLink.target = '_blank'; // Open link in a new tab

        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(sourceLink);

        reel.appendChild(overlay);
        reel.appendChild(content);

        reelsContainer.appendChild(reel);
    });
}

// Initial call to fetch news when the page loads
getNews();
