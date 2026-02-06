const { expectedMarkers, isPhpRoute } = require('../../src/routeExpectations');

describe('backend routeExpectations guard', () => {
  test('covers all expected marker branches', () => {
    expect(expectedMarkers('/')).toEqual(['<title>Bruce Care</title>', 'Home Page Stuff']);
    expect(expectedMarkers('/login.php')).toEqual(['<title>Bruce Care</title>', 'Login']);
    expect(expectedMarkers('/register.php')).toEqual(['Register']);
    expect(expectedMarkers('/contact.php')).toEqual(['Contact']);
    expect(expectedMarkers('/no-page')).toEqual(['<title>Bruce Care</title>']);
  });

  test('covers php route detection branches', () => {
    expect(isPhpRoute('/')).toBe(true);
    expect(isPhpRoute('/main.php')).toBe(true);
    expect(isPhpRoute('/main.css')).toBe(false);
  });
});
