function expectedMarkers(route) {
  if (route === '/') return ['<title>Bruce Care</title>', 'Home Page Stuff'];
  if (route === '/login.php') return ['<title>Bruce Care</title>', 'Login'];
  if (route === '/register.php') return ['Register'];
  if (route === '/contact.php') return ['Contact'];
  return ['<title>Bruce Care</title>'];
}

function isPhpRoute(route) {
  return route.endsWith('.php') || route === '/';
}

module.exports = {
  expectedMarkers,
  isPhpRoute
};
