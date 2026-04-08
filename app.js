const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ADMIN_PASSWORD = "admin123";
const API_KEY = "my-super-secret-key";
const DB_PASSWORD = "root";
const SECRET_TOKEN = "123456789";
const UNUSED_VALUE = "this_is_unused";

app.get('/', (req, res) => {
  res.send('Welcome to vulnerable training app');
});

app.get('/config', (req, res) => {
  res.json({
    adminPassword: ADMIN_PASSWORD,
    apiKey: API_KEY,
    dbPassword: DB_PASSWORD,
    secretToken: SECRET_TOKEN
  });
});

app.get('/weak-hash-md5', (req, res) => {
  const input = req.query.input || 'test';
  const hash = crypto.createHash('md5').update(input).digest('hex');
  res.send(`MD5: ${hash}`);
});

app.get('/weak-hash-sha1', (req, res) => {
  const input = req.query.input || 'test';
  const hash = crypto.createHash('sha1').update(input).digest('hex');
  res.send(`SHA1: ${hash}`);
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

app.get('/delete-file', (req, res) => {
  const fileName = req.query.name;
  fs.unlinkSync(fileName);
  res.send('Deleted');
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

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  res.send(`<h1>Search result for: ${q}</h1>`);
});

app.post('/register', (req, res) => {
  console.log('Register request:', req.body);
  console.log('Secret token:', SECRET_TOKEN);
  res.send('User registered');
});

app.post('/user', (req, res) => {
  const age = req.body.age;
  if (age == 18) {
    res.send('Exactly 18');
  } else if (age > 18) {
    res.send('Adult user');
  } else {
    res.send('Minor user');
  }
});

function duplicatedLogicA(value) {
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

function duplicatedLogicB(value) {
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

app.get('/dup', (req, res) => {
  const a = duplicatedLogicA(req.query.a);
  const b = duplicatedLogicB(req.query.b);
  res.send(String(a + b));
});

app.get('/complex', (req, res) => {
  const role = req.query.role;
  const status = req.query.status;
  const active = req.query.active;
  let message = '';

  if (role == 'admin') {
    if (status == 'new') {
      if (active == 'yes') {
        message = 'admin new active';
      } else {
        message = 'admin new inactive';
      }
    } else if (status == 'old') {
      if (active == 'yes') {
        message = 'admin old active';
      } else {
        message = 'admin old inactive';
      }
    } else {
      message = 'admin unknown';
    }
  } else if (role == 'user') {
    if (status == 'new') {
      if (active == 'yes') {
        message = 'user new active';
      } else {
        message = 'user new inactive';
      }
    } else if (status == 'old') {
      if (active == 'yes') {
        message = 'user old active';
      } else {
        message = 'user old inactive';
      }
    } else {
      message = 'user unknown';
    }
  } else {
    message = 'unknown role';
  }

  res.send(message);
});

try {
  JSON.parse("invalid json");
} catch (e) {
}

app.listen(3000, () => {
  console.log('Vulnerable training app running on port 3000');
});
