// frontend/src/services/authService.js
const API_BASE = "http://localhost:5332";

export async function activateScript() {
  const resp = await fetch(`${API_BASE}/activate_script`, { method: 'POST' });
  if (!resp.ok) throw new Error('Failed to activate script');
  return resp.json();
}

export async function checkToken(pinId) {
  const resp = await fetch(`${API_BASE}/check_token/${pinId}`);
  if (!resp.ok) throw new Error('Failed to check token');
  return resp.json();
}
