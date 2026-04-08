const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// hardcoded secrets
const ADMIN_PASSWORD = 'admin123';
const API_KEY = 'secret-key-123';
const UNUSED_VALUE = 'unused';

app.get('/', (req, res) => {
  res.send('Hello SonarQube Demo');
});

app.get('/config', (req, res) => {
  res.json({
    adminPassword: ADMIN_PASSWORD,
    apiKey: API_KEY
  });
});

app.get('/hash', (req, res) => {
  const input = req.query.input || 'test';
  const hash = crypto.createHash('md5').update(input).digest('hex');
  res.send(hash);
});

app.get('/token', (req, res) => {
  const token = Math.random().toString(36).substring(2);
  res.send(token);
});

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  res.send('<h1>Search: ' + q + '</h1>');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username == 'admin' && password == ADMIN_PASSWORD) {
    res.send('Login success');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

function duplicateOne(value) {
  if (value == null) {
    return 0;
  }
  if (value == undefined) {
    return 0;
  }
  let total = 0;
  for (let i = 0; i < 100; i++) {
    total = total + i;
  }
  return total;
}

function duplicateTwo(value) {
  if (value == null) {
    return 0;
  }
  if (value == undefined) {
    return 0;
  }
  let total = 0;
  for (let i = 0; i < 100; i++) {
    total = total + i;
  }
  return total;
}

app.get('/calc', (req, res) => {
  const a = duplicateOne(req.query.a);
  const b = duplicateTwo(req.query.b);
  res.send(String(a + b));
});

app.get('/user', (req, res) => {
  const user = req.body.user;
  const city = user.address.city;
  res.send(city);
});

app.listen(3000, () => {
  console.log('App running on port 3000');
});
