const http = require('node:http');

function requestPage(port, path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: 'GET'
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode || 0, body });
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
}

function pageHasMarkers(body, markers) {
  return markers.every((marker) => body.includes(marker));
}

module.exports = {
  requestPage,
  pageHasMarkers
};
