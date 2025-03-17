const YOURS_API_ENDPOINT = 'http://l.digitallyfruol.in/yourls-api.php';
const API_SIGNATURE = '88529f4bf9';

function switchTab(tab) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    document.querySelector(`button[onclick="switchTab('${tab}')"]`).classList.add('active');
    clearResults();
}

function clearResults() {
    document.getElementById('single-result').innerHTML = '';
    document.getElementById('bulk-result').innerHTML = '';
}

async function shortenUrl(url) {
    try {
        const response = await fetch(`${YOURS_API_ENDPOINT}?signature=${API_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data.status === 'success') {
            return data.shorturl;
        } else {
            throw new Error(data.message || 'Failed to shorten URL');
        }
    } catch (error) {
        throw new Error(error.message || 'Network error');
    }
}

async function shortenSingleUrl() {
    const url = document.getElementById('single-url').value.trim();
    const resultDiv = document.getElementById('single-result');
    resultDiv.innerHTML = '';

    if (!url) {
        resultDiv.innerHTML = '<p class="error">Please enter a URL</p>';
        return;
    }

    try {
        const shortUrl = await shortenUrl(url);
        resultDiv.innerHTML = `
            <div class="result-item">
                <a href="${shortUrl}" target="_blank">${shortUrl}</a>
                <button onclick="copyToClipboard('${shortUrl}')">Copy</button>
            </div>`;
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function shortenBulkUrls() {
    const urls = document.getElementById('bulk-urls').value.trim().split('\n').filter(url => url.trim());
    const resultDiv = document.getElementById('bulk-result');
    resultDiv.innerHTML = '';

    if (urls.length === 0) {
        resultDiv.innerHTML = '<p class="error">Please enter at least one URL</p>';
        return;
    }

    const results = [];
    for (const url of urls) {
        try {
            const shortUrl = await shortenUrl(url);
            results.push(`<div class="result-item"><a href="${shortUrl}" target="_blank">${shortUrl}</a><button onclick="copyToClipboard('${shortUrl}')">Copy</button></div>`);
        } catch (error) {
            results.push(`<div class="result-item"><span class="error">Error: ${error.message}</span></div>`);
        }
    }
    resultDiv.innerHTML = results.join('');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard: ' + text);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}
