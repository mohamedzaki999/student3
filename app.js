const express = require('express');
const { exec } = require('child_process');

const app = express();

// ❌ Command Injection (ده Vulnerability حقيقي)
app.get('/run', (req, res) => {
    const cmd = req.query.cmd;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            return res.send(error.message);
        }
        res.send(stdout);
    });
});

// ❌ SQL Injection (حتى لو fake DB Sonar بيمسكها)
app.get('/user', (req, res) => {
    const id = req.query.id;

    const query = "SELECT * FROM users WHERE id = " + id;

    res.send(query);
});

// ❌ Hardcoded credentials
const password = "123456";

app.get('/', (req, res) => {
    res.send("Hello insecure app");
});

app.listen(3000, () => {
    console.log("Server running");
});
