const React = require('react');

function AppHeader({ brand = 'BruceCare', links = [] }) {
  return React.createElement(
    'header',
    { className: 'main-header', 'data-testid': 'app-header' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'h1',
        { className: 'logo' },
        React.createElement('a', { href: 'index.php' }, brand)
      ),
      React.createElement(
        'nav',
        { 'aria-label': 'primary' },
        links.map((link) =>
          React.createElement(
            'a',
            { key: link.href, href: link.href },
            link.label
          )
        )
      )
    )
  );
}

module.exports = {
  AppHeader
};
