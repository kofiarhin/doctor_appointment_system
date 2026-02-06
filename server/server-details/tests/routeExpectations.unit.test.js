const { expectedMarkers, isAppRoute } = require('../models/routeExpectations');

describe('backend routeExpectations guard', () => {
  test('covers all expected marker branches', () => {
    expect(expectedMarkers('/')).toEqual(['<title>Bruce Care</title>', 'Home Page Stuff']);
    expect(expectedMarkers('/login')).toEqual(['<title>Bruce Care</title>', 'Login']);
    expect(expectedMarkers('/register')).toEqual(['Register']);
    expect(expectedMarkers('/contact')).toEqual(['Contact']);
    expect(expectedMarkers('/no-page')).toEqual(['<title>Bruce Care</title>']);
  });

  test('covers app route detection branches', () => {
    expect(isAppRoute('/')).toBe(true);
    expect(isAppRoute('/register')).toBe(true);
    expect(isAppRoute('/main.css')).toBe(false);
  });
});
