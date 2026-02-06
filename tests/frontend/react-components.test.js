const React = require('react');
const { render, screen } = require('@testing-library/react');
const { AppHeader } = require('../../src/components/AppHeader');

describe('AppHeader component', () => {
  it('renders brand and navigation links', () => {
    const links = [
      { href: '/login.php', label: 'Login' },
      { href: '/register.php', label: 'Register' }
    ];

    render(React.createElement(AppHeader, { brand: 'DevKofi Care', links }));

    expect(screen.getByTestId('app-header')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'DevKofi Care' }).getAttribute('href')).toBe('index.php');
    expect(screen.getByRole('link', { name: 'Login' }).getAttribute('href')).toBe('/login.php');
    expect(screen.getByRole('link', { name: 'Register' }).getAttribute('href')).toBe('/register.php');
  });

  it('renders empty navigation safely', () => {
    render(React.createElement(AppHeader, null));

    expect(screen.getByRole('navigation', { name: 'primary' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'BruceCare' })).toBeTruthy();
  });
});
