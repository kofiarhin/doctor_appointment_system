const { expectedMarkers, isPhpRoute } = require('../../src/routeExpectations');

describe('routeExpectations', () => {
  it('returns expected markers per route', () => {
    expect(expectedMarkers('/')).toEqual(['<title>Bruce Care</title>', 'Home Page Stuff']);
    expect(expectedMarkers('/login.php')).toEqual(['<title>Bruce Care</title>', 'Login']);
    expect(expectedMarkers('/register.php')).toEqual(['Register']);
    expect(expectedMarkers('/contact.php')).toEqual(['Contact']);
    expect(expectedMarkers('/unknown')).toEqual(['<title>Bruce Care</title>']);
  });

  it('identifies php routes', () => {
    expect(isPhpRoute('/')).toBe(true);
    expect(isPhpRoute('/login.php')).toBe(true);
    expect(isPhpRoute('/asset.css')).toBe(false);
  });
});
