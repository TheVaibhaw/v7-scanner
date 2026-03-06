'use strict';

var fs = require('fs');
var path = require('path');
var { scanFile } = require('../src/scanner.js');

var COLORS = {
    reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m', cyan: '\x1b[36m', bold: '\x1b[1m'
};

var TMP_JS = path.join(__dirname, 'temp.js');
var TMP_JSX = path.join(__dirname, 'temp.jsx');
var TMP_HTML = path.join(__dirname, 'temp.html');
var TMP_CSS = path.join(__dirname, 'temp.css');

var testsPassed = 0;
var testsTotal = 0;

function runTest(file, name, code, expectedErrors, expectedWarnings, expectedInfos) {
    var expI = expectedInfos || 0;
    testsTotal++;
    fs.writeFileSync(file, code, 'utf-8');

    var result = scanFile(file);
    var pass = result.errors.length === expectedErrors &&
        result.warnings.length === expectedWarnings &&
        result.infos.length === expI;

    if (pass) {
        console.log('  ' + COLORS.green + '✓' + COLORS.reset + ' ' + name);
        testsPassed++;
    } else {
        console.log('  ' + COLORS.red + '✗' + COLORS.reset + ' ' + name);
        console.log('    Expected: E:' + expectedErrors + ' W:' + expectedWarnings + ' I:' + expI);
        console.log('    Got:      E:' + result.errors.length + ' W:' + result.warnings.length + ' I:' + result.infos.length);
        if (result.errors.length > 0) console.log('    Errors:   ', result.errors.map(function (e) { return e.id; }));
        if (result.warnings.length > 0) console.log('    Warnings: ', result.warnings.map(function (w) { return w.id; }));
        if (result.infos.length > 0) console.log('    Infos:    ', result.infos.map(function (i) { return i.id; }));
    }
}

console.log('\n' + COLORS.bold + COLORS.cyan + '⚡ V7 Scanner — Massive Ruleset Tests' + COLORS.reset + '\n');

// LEVEL 1
runTest(TMP_JS, 'L101 - Console', 'console.log("hello");', 0, 1);
runTest(TMP_JS, 'L102 - Debugger', 'debugger;', 0, 1);
runTest(TMP_JS, 'L103 - Loose Eq', 'if (x == 1) {}', 0, 1);
runTest(TMP_JS, 'L104 - Var Usage', 'var x = 1;', 0, 1);
runTest(TMP_JS, 'L105 - Unreachable return', 'function() { return; let x; }', 0, 1);

// LEVEL 2
runTest(TMP_JS, 'L201 - Empty Catch', 'try {} catch(e) {}', 0, 1);
runTest(TMP_JS, 'L202 - Missing Radix', 'parseInt("10");', 0, 1);
runTest(TMP_JS, 'L203 - Await in Loop', 'for(var i=0;i<10;i++) { await fetch(); }', 0, 1);

// LEVEL 3
runTest(TMP_JS, 'L301 - Eval', 'eval("1+1");', 1, 0);
runTest(TMP_JS, 'L302 - String Timeout', 'setTimeout("alert(1)");', 1, 0);
runTest(TMP_JS, 'L303 - Hardcoded Secret', 'const SECRET = "mysecret123";', 1, 0);
runTest(TMP_JS, 'L304 - SQL Injection', 'let sql = "SELECT * FROM users WHERE id=" + id;', 1, 0);
runTest(TMP_JSX, 'L305 - innerHTML', 'div.innerHTML = "<p>";', 1, 0);
runTest(TMP_JS, 'L306 - Unnecessary Delete', 'delete obj.prop;', 0, 1);
runTest(TMP_JS, 'L307 - Global Pollution', 'window.prop = 1;', 0, 1);

// LEVEL 4
runTest(TMP_JSX, 'L401 - Missing Key Map', 'users.map(u => <li>{u.name}</li>)', 0, 1);
runTest(TMP_JSX, 'L402 - Inline JSX Func', '<button onClick={() => set(1)}>', 0, 0, 1);
runTest(TMP_JSX, 'L403 - DangerouslySet', '<div dangerouslySetInnerHTML={{__html: ""}} />', 1, 0);

// LEVEL 5
runTest(TMP_HTML, 'L501 - Inline Styles', '<div style="color:red">', 0, 1);
runTest(TMP_HTML, 'L502 - Missing Image Alt', '<img src="cat.jpg">', 0, 1);
runTest(TMP_HTML, 'L503 - Deprecated Tag', '<center>Text</center>', 0, 1);
runTest(TMP_CSS, 'L504 - CSS Important', 'body { margin: 0 !important; }', 0, 1);

// Cleanup
[TMP_JS, TMP_JSX, TMP_HTML, TMP_CSS].forEach(function (f) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
});

console.log('\n' + COLORS.bold + '─── Results ───' + COLORS.reset);
console.log(' Total:  ' + testsTotal);
if (testsPassed === testsTotal) {
    console.log(COLORS.green + ' Passed: ' + testsPassed + COLORS.reset + '\n');
    process.exit(0);
} else {
    console.log(COLORS.red + ' Failed: ' + (testsTotal - testsPassed) + COLORS.reset + '\n');
    process.exit(1);
}
