// app.js - Training script to trigger SonarQube issues

const express = require('express');
const app = express();
const fs = require('fs');

// 1. SECURITY ISSUE (Vulnerability/Hotspot)
// Rule: Use of hardcoded credentials and weak hashing
const adminPassword = "SuperSecretPassword123!"; // Hardcoded secret
const crypto = require('crypto');
const md5Hash = crypto.createHash('md5').update(adminPassword).digest('hex'); // MD5 is insecure/deprecated

// 2. RELIABILITY ISSUE (Bug)
// Rule: Predictable bugs, like unreachable code or potential null pointers
function checkStatus(status) {
    if (status === "active") {
        return true;
        console.log("This will never run"); // Unreachable code (Bug)
    }
    // Bug: No return statement for other paths, leads to 'undefined' behavior
}

// 3. MAINTAINABILITY ISSUE (Code Smell)
// Rule: Cognitive complexity and "Bad Smells"
function deeplyNestedFunction(a, b, c) {
    if (a) {
        if (b) {
            if (c) {
                for (let i = 0; i < 10; i++) {
                    if (i % 2 === 0) {
                        // High cognitive complexity (Code Smell)
                        console.log("Too many branches!");
                    }
                }
            }
        }
    }
}

// Another Maintainability Issue: Unused variables
const unusedVar = "I am not used anywhere"; 

app.get('/', (req, res) => {
    res.send('SonarQube Demo Running');
});

app.listen(3000);



