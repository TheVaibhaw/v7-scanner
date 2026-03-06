<h1 align="center">🛡️ V7 Scanner</h1>

<p align="center">
  <strong>Lightning-fast, zero-dependency static analysis tool for detecting security vulnerabilities, SQL injections, XSS risks, and common code bugs.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/v7-scanner"><img src="https://img.shields.io/npm/v/v7-scanner.svg?style=flat-square&color=00d4ff" alt="npm version"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg?style=flat-square" alt="Node.js"></a>
  <a href="https://www.npmjs.com/package/v7-scanner"><img src="https://img.shields.io/badge/dependencies-0-green.svg?style=flat-square" alt="Zero Dependencies"></a>
  <a href="https://github.com/TheVaibhaw/v7-scanner"><img src="https://img.shields.io/badge/GitHub-TheVaibhaw-181717.svg?style=flat-square&logo=github" alt="GitHub"></a>
</p>

---

## 🌟 Why V7 Scanner?

| Feature | V7 Scanner | Heavy Linters |
|---------|:---:|:---:|
| Zero Dependencies | ✅ | ❌ |
| Instant Install | ✅ | ❌ |
| Security Focused | ✅ | ❌ (requires heavy plugins) |
| No Configuration Hell | ✅ | ❌ |
| CI/CD Ready | ✅ | ✅ |

---

## 🎯 Comprehensive 5-Level Ruleset

V7 Scanner includes 22 custom rules from beginner to advanced:

### 🔰 Level 1: Beginner (Syntax & Safety)
- **`console.log()`** — Leftover debug statements.
- **`debugger`** — Leftover breakpoints.
- **Loose Equality** — Flags `==` and `!=`, advising `===` and `!==`.
- **`var` Usage** — Recommends `let` or `const` to prevent hoisting bugs.
- **Unreachable Code** — Code immediately following `return`.

### 📘 Level 2: Intermediate (Best Practices)
- **Empty `catch(e) {}` Blocks** — Flags swallowed errors that mask app failures.
- **Missing Radix in `parseInt`** — Forces `parseInt(x, 10)` to avoid octal bugs.
- **`await` Inside Loops** — Flags slow, sequential execution. Recommend `Promise.all`.
- **Callback Hell** — Warns against deeply nested functions.

### 🔴 Level 3: Advanced (Security & Perf) — EXITS 1
- **`eval()` Usage** — Prevents arbitrary code execution.
- **`setTimeout(string)`** — Prevents string-to-code eval vulnerabilities.
- **Hardcoded Secrets** — Detects exposed API Keys and Passwords.
- **SQL Injection Risks** — Detects loose string concatenation in SQL queries.
- **`.innerHTML` Assignment** — Flags Cross-Site Scripting (XSS) risks.
- **Unnecessary `delete`** — Warns about breaking V8 engine optimizations.
- **Global Scope Pollution** — `window.prop = 1` assignments.

### ⚛️ Level 4: React & JSX
- **Missing `key` in Map** — `array.map(item => <div/>)` missing keys.
- **Inline Arrow Functions** — `<button onClick={() => ...}` performance info.
- **`dangerouslySetInnerHTML`** — Direct XSS vulnerability flag.

### 🎨 Level 5: HTML & CSS
- **Inline Styles** — `<div style="...">` maintainability warnings.
- **Missing `alt` on Images** — SEO and Accessibility warning.
- **Deprecated Tags** — Usage of `<font>`, `<center>`, etc.
- **CSS `!important`** — Warns against breaking CSS cascading rules.

---

## 🚀 Quick Start

### Install Globally (Recommended)
```bash
npm install -g v7-scanner
```

### Use Without Installing
```bash
npx v7-scanner .
```

### Scan Your Project
```bash
# Scan current directory recursively
v7-scanner .

# Scan specific directories
v7-scanner src/ components/

# Scan a single file
v7-scanner app.js
```

---

## 💡 Output Example

Clicking the file paths in your IDE (like VS Code) will open the exact file automatically.

```
./src/auth.js
  ✖ 12:4  error  Potential hardcoded secret or API key detected.  S004
      const API_KEY = "sk_live_123456789";
  ⚠ 45:1  warning  Remove console statements before production.  B001
      console.log("User logged in");

  ─── Summary ───
  Files scanned:  24 / 45
  ✖ Errors (Critical): 1
  ⚠ Warnings (Bugs):   1
  Time:                18ms
```

> **Note:** If **Errors (Critical)** are found, V7 Scanner exits with code `1` so it can block vulnerable PRs in your CI/CD pipeline. 

---

## 🔌 Programmatic API

```javascript
const { scan, scanDirectory } = require('v7-scanner');

// Scan a single file
const result = scan('./src/app.js');
console.log(result.errors);
console.log(result.warnings);

// Scan a full directory
const dirResult = scanDirectory('./src');
console.log(`Found ${dirResult.totalErrors} security issues!`);
```

---

## 🚫 Ignore Files

V7 Scanner automatically ignores:
`node_modules`, `.git`, `dist`, `build`, `coverage`, `.next`, `.nuxt`, `.cache`, `vendor`, `package-lock.json`, `yarn.lock`.

You can pass specific directories to override default scanning paths. Large files (>5MB) are automatically skipped for performance.

---

## 🔒 Security Guarantee

- **Never Executes Your Code:** Uses safe text analysis, AST-lite parsing, and Regex.
- **No Network Access:** Never phones home or sends your code anywhere.
- **Zero Supply Chain Risk:** Contains exactly 0 dependencies.

---

## 👨‍💻 Author

**TheVaibhaw**
- 🌐 Website: [vaibhawkumarparashar.in](https://www.vaibhawkumarparashar.in)
- 🐙 GitHub: [@TheVaibhaw](https://github.com/TheVaibhaw)

<p align="center">
  Made by <a href="https://github.com/TheVaibhaw">Vaibhaw Kumar Parashar</a>
</p>
