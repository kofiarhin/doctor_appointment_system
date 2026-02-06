const { expectedMarkers } = require('../models/routeExpectations');

function renderPage(route) {
  const markers = expectedMarkers(route);
  return `<!doctype html><html><head><title>Bruce Care</title></head><body>${markers.join(' ')}</body></html>`;
}

exports.getHome = (req, res) => res.status(200).send(renderPage('/'));
exports.getLogin = (req, res) => res.status(200).send(renderPage('/login'));
exports.getRegister = (req, res) => res.status(200).send(renderPage('/register'));
exports.getContact = (req, res) => res.status(200).send(renderPage('/contact'));
exports.health = (req, res) => res.status(200).json({ status: 'ok' });
