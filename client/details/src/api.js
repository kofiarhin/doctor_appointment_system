export const baseUrl = 'http://localhost:5000';

export async function getHealth() {
  const response = await fetch(`${baseUrl}/api/health`);
  if (!response.ok) throw new Error('Health check failed');
  return response.json();
}
