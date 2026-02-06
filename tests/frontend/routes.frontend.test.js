const { requestPage, pageHasMarkers } = require('../shared/httpClient');
const { startPhpServer, stopPhpServer } = require('../shared/phpServer');
const { expectedMarkers, isPhpRoute } = require('../../src/routeExpectations');

const PORT = 4010;
let server;

beforeAll(async () => {
  server = startPhpServer(PORT);
  await new Promise((resolve) => setTimeout(resolve, 1200));
});

afterAll(() => {
  stopPhpServer(server);
});

describe('frontend page rendering', () => {
  it('renders home page with layout markers', async () => {
    const response = await requestPage(PORT, '/');
    expect(response.status).toBe(200);
    expect(isPhpRoute('/')).toBe(true);
    expect(pageHasMarkers(response.body, expectedMarkers('/'))).toBe(true);
  });

  it('renders login page with form markers', async () => {
    const response = await requestPage(PORT, '/login.php');
    expect(response.status).toBe(200);
    expect(isPhpRoute('/login.php')).toBe(true);
    expect(pageHasMarkers(response.body, expectedMarkers('/login.php'))).toBe(true);
  });
});
