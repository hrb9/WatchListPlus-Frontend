// frontend/src/services/containerManagerService.js

const CONTAINER_MANAGER_BASE = "http://localhost:5450"; // Adjust as needed

export async function listAllMicroservices() {
  const resp = await fetch(`${CONTAINER_MANAGER_BASE}/containers/list`);
  if (!resp.ok) {
    throw new Error('Failed to fetch microservices list');
  }
  return resp.json();
}

export async function installOrUpdateService(serviceName, action) {
  // action should be either "install" or "update"
  const resp = await fetch(`${CONTAINER_MANAGER_BASE}/containers/install_or_update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_name: serviceName, action })
  });
  if (!resp.ok) {
    throw new Error(`Failed to ${action} service ${serviceName}`);
  }
  return resp.json();
}
