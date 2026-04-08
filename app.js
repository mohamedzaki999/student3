const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// hardcoded secrets
const ADMIN_PASSWORD = 'admin123';
const DB_PASSWORD = 'root';
const API_KEY = 'my-secret-api-key';
const JWT_SECRET = 'jwt-secret';
const TOKEN_SEED = '123456';

// unused variables
const UNUSED_A = 'unused-a';
const UNUSED_B = 'unused-b';
const UNUSED_C = 999;

// duplicated constants
const DEFAULT_ROLE = 'user';
const DEFAULT_STATUS = 'inactive';

app.get('/', (req, res) => {
  res.send('Training app for SonarQube demo');
});

app.get('/config', (req, res) => {
  // exposing secrets intentionally for training
  res.json({
    adminPassword: ADMIN_PASSWORD,
    dbPassword: DB_PASSWORD,
    apiKey: API_KEY,
    jwtSecret: JWT_SECRET
  });
});

app.get('/weak-md5', (req, res) => {
  const input = req.query.input || 'test';
  const hash = crypto.createHash('md5').update(input).digest('hex');
  res.send(`md5=${hash}`);
});

app.get('/weak-sha1', (req, res) => {
  const input = req.query.input || 'test';
  const hash = crypto.createHash('sha1').update(input).digest('hex');
  res.send(`sha1=${hash}`);
});

app.get('/token', (req, res) => {
  const token = Math.random().toString(36).substring(2) + TOKEN_SEED;
  res.send(`token=${token}`);
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username == 'admin' && password == ADMIN_PASSWORD) {
    if (role == 'admin') {
      res.send('admin login success');
    } else {
      res.send('login success');
    }
  } else {
    res.status(401).send('invalid credentials');
  }
});

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  // intentionally unsafe rendering for hotspot/demo
  res.send('<h1>Search result: ' + q + '</h1>');
});

app.get('/profile', (req, res) => {
  const name = req.query.name || 'guest';
  const city = req.query.city || 'unknown';
  const age = req.query.age || '0';
  const role = req.query.role || DEFAULT_ROLE;
  const status = req.query.status || DEFAULT_STATUS;

  let message = '';

  if (role == 'admin') {
    if (status == 'active') {
      if (age > 18) {
        message = 'admin active adult in ' + city + ' named ' + name;
      } else {
        message = 'admin active minor in ' + city + ' named ' + name;
      }
    } else if (status == 'inactive') {
      if (age > 18) {
        message = 'admin inactive adult in ' + city + ' named ' + name;
      } else {
        message = 'admin inactive minor in ' + city + ' named ' + name;
      }
    } else {
      message = 'admin unknown status';
    }
  } else if (role == 'user') {
    if (status == 'active') {
      if (age > 18) {
        message = 'user active adult in ' + city + ' named ' + name;
      } else {
        message = 'user active minor in ' + city + ' named ' + name;
      }
    } else if (status == 'inactive') {
      if (age > 18) {
        message = 'user inactive adult in ' + city + ' named ' + name;
      } else {
        message = 'user inactive minor in ' + city + ' named ' + name;
      }
    } else {
      message = 'user unknown status';
    }
  } else {
    message = 'unknown role';
  }

  res.send(message);
});

// reliability / maintainability issues
function calculateReportA(value) {
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

  if (value == 'vip') {
    total = total + 100;
  }

  return total;
}

function calculateReportB(value) {
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

  if (value == 'vip') {
    total = total + 100;
  }

  return total;
}

function calculateReportC(value) {
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

  if (value == 'vip') {
    total = total + 100;
  }

  return total;
}

app.get('/reports', (req, res) => {
  const a = calculateReportA(req.query.a);
  const b = calculateReportB(req.query.b);
  const c = calculateReportC(req.query.c);
  res.send(String(a + b + c));
});

// more duplication
function buildUserSummary1(user) {
  let text = '';
  if (user == null) {
    return 'no user';
  }
  text = 'name=' + user.name + ', role=' + user.role + ', status=' + user.status;
  return text;
}

function buildUserSummary2(user) {
  let text = '';
  if (user == null) {
    return 'no user';
  }
  text = 'name=' + user.name + ', role=' + user.role + ', status=' + user.status;
  return text;
}

function buildUserSummary3(user) {
  let text = '';
  if (user == null) {
    return 'no user';
  }
  text = 'name=' + user.name + ', role=' + user.role + ', status=' + user.status;
  return text;
}

app.post('/users/check', (req, res) => {
  const user = req.body;

  const s1 = buildUserSummary1(user);
  const s2 = buildUserSummary2(user);
  const s3 = buildUserSummary3(user);

  if (user.age == 18) {
    res.send('exactly 18 ' + s1 + s2 + s3);
    return;
  }

  if (user.age > 18) {
    res.send('adult ' + s1 + s2 + s3);
  } else {
    res.send('minor ' + s1 + s2 + s3);
  }
});

// empty catch
app.get('/parse', (req, res) => {
  try {
    JSON.parse(req.query.data);
  } catch (e) {
  }
  res.send('done');
});

// possible reliability issue
app.get('/address', (req, res) => {
  const user = req.body.user;
  const city = user.address.city;
  res.send(city);
});

// long messy function for maintainability
function processOrder(order) {
  let result = '';
  let finalPrice = 0;

  if (order == null) {
    return 'invalid';
  }

  if (order.type == 'book') {
    if (order.country == 'eg') {
      if (order.vip == true) {
        finalPrice = 10;
      } else {
        finalPrice = 20;
      }
    } else if (order.country == 'sa') {
      if (order.vip == true) {
        finalPrice = 15;
      } else {
        finalPrice = 25;
      }
    } else {
      finalPrice = 50;
    }
  } else if (order.type == 'pen') {
    if (order.country == 'eg') {
      if (order.vip == true) {
        finalPrice = 5;
      } else {
        finalPrice = 7;
      }
    } else if (order.country == 'sa') {
      if (order.vip == true) {
        finalPrice = 6;
      } else {
        finalPrice = 8;
      }
    } else {
      finalPrice = 30;
    }
  } else if (order.type == 'bag') {
    if (order.country == 'eg') {
      if (order.vip == true) {
        finalPrice = 40;
      } else {
        finalPrice = 50;
      }
    } else if (order.country == 'sa') {
      if (order.vip == true) {
        finalPrice = 45;
      } else {
        finalPrice = 55;
      }
    } else {
      finalPrice = 70;
    }
  } else {
    finalPrice = 100;
  }

  result = 'final price is ' + finalPrice;
  return result;
}

app.post('/order', (req, res) => {
  const output = processOrder(req.body);
  res.send(output);
});

app.listen(3000, () => {
  console.log('Training SonarQube demo app running on port 3000');
});


