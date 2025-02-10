// frontend/src/services/usersRequestsService.js

const USERS_REQUESTS_BASE = "http://localhost:5339"; // Adjust according to your UsersAndRequests service URL

export async function getRequests(userId) {
  // You might need to filter by user if non-admin
  const resp = await fetch(`${USERS_REQUESTS_BASE}/get_requests?user_id=${userId}`);
  if (!resp.ok) {
    throw new Error('Failed to fetch requests');
  }
  return resp.json();
}

export async function addRequest(imdb_id, username, type) {
  const resp = await fetch(`${USERS_REQUESTS_BASE}/add_request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imdb_id, username, type })
  });
  if (!resp.ok) {
    throw new Error('Failed to add request');
  }
  return resp.json();
}

export async function approveRequest(requestId, adminUsername) {
  const resp = await fetch(`${USERS_REQUESTS_BASE}/approve_request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_id: requestId, admin_username: adminUsername })
  });
  if (!resp.ok) {
    throw new Error('Failed to approve request');
  }
  return resp.json();
}
