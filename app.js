// app.js - Full training script for SonarQube issues
const express = require('express');
const app = express();
const crypto = require('crypto');

// 1. SECURITY VULNERABILITIES (Security Rating)
const adminPassword = "SuperSecretPassword123!"; // Flag: Hardcoded Secret
const md5Hash = crypto.createHash('md5').update('data').digest('hex'); // Flag: Weak Cryptography
const userInput = "console.log('hacked')"; 
eval(userInput); // Flag: Code Injection (Security Risk)

// 2. RELIABILITY ISSUES (Bugs)
function checkStatus(status) {
    if (status === "active") {
        return true;
        console.log("This will never run"); // Flag: Unreachable code (Bug)
    }
    // Flag: Missing return statement for other paths (Bug)
}

// 3. MAINTAINABILITY ISSUES (Code Smells)
const unusedVariable = "I am not used"; // Flag: Unused variable (Code Smell)

function complexFunction(a, b, c) {
    if (a) {
        if (b) {
            if (c) {
                for (let i = 0; i < 10; i++) {
                    if (i % 2 === 0) {
                        console.log("High Cognitive Complexity"); // Flag: Code Smell
                    }
                }
            }
        }
    }
}

// 4. DUPLICATION (Duplications Percentage)
// SonarQube needs 10+ lines of identical code to trigger a duplication flag.
function processUserData(user) {
    if (!user) return null;
    let name = user.name;
    let email = user.email;
    let role = user.role;
    console.log("Processing User: " + name);
    console.log("Email: " + email);
    console.log("Role: " + role);
    return { name, email, role };
}

// Copy-pasting the exact same block to trigger duplication
function processAdminData(admin) {
    if (!admin) return null;
    let name = admin.name;
    let email = admin.email;
    let role = admin.role;
    console.log("Processing User: " + name);
    console.log("Email: " + email);
    console.log("Role: " + role);
    return { name, email, role };
}

app.get('/', (req, res) => {
    res.send('SonarQube Training Active');
});

app.listen(3000);
