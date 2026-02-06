const { requestPage, pageHasMarkers } = require('../shared/httpClient');
const { startPhpServer, stopPhpServer } = require('../shared/phpServer');
const { expectedMarkers, isPhpRoute } = require('../../src/routeExpectations');

const PORT = 4011;
let server;

beforeAll(async () => {
  server = startPhpServer(PORT);
  await new Promise((resolve) => setTimeout(resolve, 1200));
});

afterAll(() => {
  stopPhpServer(server);
});

describe('backend route responses', () => {
  test('contact route responds correctly', async () => {
    const response = await requestPage(PORT, '/contact.php');
    expect(response.status).toBe(200);
    expect(isPhpRoute('/contact.php')).toBe(true);
    expect(pageHasMarkers(response.body, expectedMarkers('/contact.php'))).toBe(true);
  });

  test('register route responds correctly', async () => {
    const response = await requestPage(PORT, '/register.php');
    expect(response.status).toBe(200);
    expect(isPhpRoute('/register.php')).toBe(true);
    expect(pageHasMarkers(response.body, expectedMarkers('/register.php'))).toBe(true);
  });
});
