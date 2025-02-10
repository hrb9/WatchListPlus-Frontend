// frontend/src/services/watchlistService.js

const WATCHLIST_BASE = "http://localhost:5342"; // Adjust according to your Watchlist service URL

export async function getWatchlist(username, token) {
  // Assume you pass the username and token as query parameters
  const resp = await fetch(`${WATCHLIST_BASE}/watchlist?username=${username}&token=${token}`);
  if (!resp.ok) {
    throw new Error('Failed to fetch watchlist');
  }
  return resp.json();
}

export async function addToWatchlist(username, token, imdb_id) {
  const resp = await fetch(`${WATCHLIST_BASE}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, token, imdb_id })
  });
  if (!resp.ok) {
    throw new Error('Failed to add item to watchlist');
  }
  return resp.json();
}
