function expectedMarkers(route) {
  if (route === '/') return ['<title>Bruce Care</title>', 'Home Page Stuff'];
  if (route === '/login') return ['<title>Bruce Care</title>', 'Login'];
  if (route === '/register') return ['Register'];
  if (route === '/contact') return ['Contact'];
  return ['<title>Bruce Care</title>'];
}

function isAppRoute(route) {
  return ['/', '/login', '/register', '/contact'].includes(route);
}

module.exports = {
  expectedMarkers,
  isAppRoute
};
