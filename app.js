const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ADMIN_PASSWORD = "admin123";
const API_KEY = "my-super-secret-key";

app.get('/', (req, res) => {
  res.send('Welcome to insecure training app');
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
  res.send(`MD5 hash: ${hash}`);
});

app.get('/token', (req, res) => {
  const token = Math.random().toString(36).substring(2);
  res.send(`Generated token: ${token}`);
});

app.get('/calc', (req, res) => {
  const formula = req.query.formula || '2+2';
  const result = eval(formula);
  res.send(`Result: ${result}`);
});

app.get('/ping', (req, res) => {
  const host = req.query.host || '127.0.0.1';
  exec(`ping -c 1 ${host}`, (err, stdout, stderr) => {
    if (err) {
      return res.send(stderr);
    }
    res.send(stdout);
  });
});

app.get('/read-file', (req, res) => {
  const fileName = req.query.name || 'notes.txt';
  const content = fs.readFileSync(fileName, 'utf8');
  res.send(content);
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === 'admin' && password === ADMIN_PASSWORD) {
    res.send('Login success');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  res.send(`<h1>Search result for: ${q}</h1>`);
});

app.post('/register', (req, res) => {
  console.log('New user registration:', req.body);
  res.send('User registered');
});

app.post('/user', (req, res) => {
  const age = req.body.age;
  if (age > 18) {
    res.send('Adult user');
  } else {
    res.send('Minor user');
  }
});

app.listen(3000, () => {
  console.log('Insecure training app running on port 3000');
});
