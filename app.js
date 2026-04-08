const express = require('express');
const app = express();
const mysql = require('mysql'); // Ensure this is in your package.json
const fs = require('fs');
const crypto = require('crypto');

// --- 1. SECURITY VULNERABILITIES (The "Missing" Piece) ---
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const connection = mysql.createConnection({host: 'localhost', user: 'root', password: 'password'});
    
    // SQL INJECTION: Directly using user input in a query
    const query = "SELECT * FROM users WHERE id = " + userId; 
    connection.query(query, (err, result) => { res.send(result); });

    // PATH TRAVERSAL: Directly using user input to access files
    const fileName = req.query.file;
    fs.readFile('/data/safe/' + fileName, (err, data) => { res.send(data); });
    
    // CODE INJECTION: eval() is a high-priority vulnerability
    eval(req.query.cmd); 
});

// --- 2. SECURITY HOTSPOTS ---
// These are often shown in a separate "Hotspots" tab, not the main "Vulnerabilities" list
const weakHash = crypto.createHash('md5').update('sensitive').digest('hex'); 
const hardcodedPassword = "AdminPassword123!"; 

// --- 3. RELIABILITY (Bugs) ---
function getStatus(val) {
    if (val === 1) {
        return "Active";
        console.log("Dead code"); // Bug: Unreachable
    }
    // Bug: Path with no return
}

// --- 4. MAINTAINABILITY (Code Smells) ---
const unused = "delete me"; 
function complex() { if(1){ if(2){ if(3){ if(4){ console.log("Too deep"); } } } } }

// --- 5. DUPLICATION ---
// Block 1
function syncDataA() {
    console.log("Syncing...");
    let x = 10; let y = 20; let z = x + y;
    console.log("Result is: " + z);
    return z;
}
// Block 2 (Exact Duplicate)
function syncDataB() {
    console.log("Syncing...");
    let x = 10; let y = 20; let z = x + y;
    console.log("Result is: " + z);
    return z;
}

app.listen(3000);
