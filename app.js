const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// hardcoded secret
const API_KEY = 'secret-123456';
const ADMIN_PASSWORD = 'admin123';

app.get('/', (req, res) => {
  res.send('Hello SonarQube');
});

// hotspot: exposing secret
app.get('/config', (req, res) => {
  res.json({
    apiKey: API_KEY,
    adminPassword: ADMIN_PASSWORD
  });
});

// hotspot: weak hash
app.get('/hash', (req, res) => {
  const input = req.query.input || 'test';
  const hash = crypto.createHash('md5').update(input).digest('hex');
  res.send(hash);
});

// hotspot: weak random
app.get('/token', (req, res) => {
  const token = Math.random().toString(36).substring(2);
  res.send(token);
});

// hotspot: reflected html
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  res.send('<h1>Result: ' + q + '</h1>');
});

app.listen(3000, () => {
  console.log('App running on port 3000');
});
