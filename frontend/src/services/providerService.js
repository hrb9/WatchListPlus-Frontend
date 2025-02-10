// frontend/src/services/providerService.js

const providerBase = "http://localhost:5446"; // Example base URL

export async function listServers() {
  const resp = await fetch(`${providerBase}/servers`);
  if (!resp.ok) {
    throw new Error('Failed to list servers');
  }
  return resp.json();
}

export async function addServer(server_type, server_address, api_key) {
  const resp = await fetch(`${providerBase}/server/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ server_type, server_address, api_key })
  });
  if (!resp.ok) {
    return { success: false };
  }
  return resp.json();
}

export async function setDefaultQualityProfile(serverId, profileName) {
  const resp = await fetch(`${providerBase}/server/${serverId}/quality_profile/default`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quality_profile: profileName })
  });
  if (!resp.ok) {
    throw new Error('Failed to set default quality profile');
  }
  return resp.json();
}

export async function setDefaultServer(serverId) {
  const resp = await fetch(`${providerBase}/server/${serverId}/default`, {
    method: 'PUT'
  });
  if (!resp.ok) {
    throw new Error('Failed to set default server');
  }
  return resp.json();
}

/**
 * Adds a media item to the provider.
 * @param {Object} params - Contains imdb_id and media_type ("movie" or "series").
 */
export async function addMediaToProvider({ imdb_id, media_type }) {
  const endpoint = media_type === 'movie'
    ? `${providerBase}/media/add?media_type=movie`
    : `${providerBase}/media/add?media_type=series`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imdb_id })
  });
  if (!resp.ok) {
    throw new Error('Failed to add media to provider');
  }
  return resp.json();
}
