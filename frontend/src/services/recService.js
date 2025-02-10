// frontend/src/services/recService.js

const REC_BASE = "http://localhost:5335"; // Adjust according to your RecByHistory service URL

export async function fetchMonthlyRecommendations(userId) {
  // Example endpoint; adjust if needed
  const resp = await fetch(`${REC_BASE}/monthly_recommendations?user_id=${userId}`);
  if (!resp.ok) {
    throw new Error('Failed to fetch monthly recommendations');
  }
  return resp.json();
}

export async function fetchDiscoveryRecommendations(userId) {
  // Example endpoint; adjust if needed
  const resp = await fetch(`${REC_BASE}/discovery_recommendations?user_id=${userId}`);
  if (!resp.ok) {
    throw new Error('Failed to fetch discovery recommendations');
  }
  return resp.json();
}

/**
 * Post discovery recommendations parameters.
 * @param {Object} params - Should include user_id, gemini_api_key, tmdb_api_key, num_movies, num_series, extra_elements.
 */
export async function postDiscoveryRecommendations(params) {
  const resp = await fetch(`${REC_BASE}/discovery_recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!resp.ok) {
    throw new Error('Failed to post discovery recommendations');
  }
  return resp.json();
}
