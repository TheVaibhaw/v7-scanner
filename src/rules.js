'use strict';

/**
 * -------------------------------------------------------------
 * LEVEL 1: BEGINNER (Syntax & Safety)
 * -------------------------------------------------------------
 */
var LEVEL_1_RULES = [
    {
        id: 'L101',
        name: 'Console Statement Left',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /\bconsole\.(log|debug|info|dir|trace)\s*\(/,
        message: 'Remove console statements before production to keep logs clean and prevent memory leaks.'
    },
    {
        id: 'L102',
        name: 'Debugger Left',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /^\s*debugger\s*;?/,
        message: 'Debugger statement left in code. This pauses execution and must be removed before production.'
    },
    {
        id: 'L103',
        name: 'Loose Equality',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /(?<![=!])==(?!=)|(?<![=!])!=(?!=)/,
        message: 'Expected === or !== and instead saw == or !=. Loose equality causes unexpected type coercion bugs.'
    },
    {
        id: 'L104',
        name: 'Var Usage',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /\bvar\s+[a-zA-Z_$][0-9a-zA-Z_$]*/,
        message: 'Use let or const instead of var to ensure block scoping and prevent hoisting bugs.'
    },
    {
        id: 'L105',
        name: 'Unreachable Code after Return',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /return(\s+[^;]*)?;\s*[a-zA-Z_$]+/,
        message: 'Potential unreachable code detected immediately after a return statement.'
    }
];

/**
 * -------------------------------------------------------------
 * LEVEL 2: INTERMEDIATE (Best Practices)
 * -------------------------------------------------------------
 */
var LEVEL_2_RULES = [
    {
        id: 'L201',
        name: 'Empty Catch Block',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /catch\s*\([^)]*\)\s*\{\s*\}/,
        message: 'Empty catch block detected. Swallowing errors masks critical app failures. Always log or handle them.'
    },
    {
        id: 'L202',
        name: 'Missing Radix in parseInt',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /parseInt\s*\(\s*[^,]+(?:\)|,\s*(?!10|\d)\s*\w+\))/,
        message: 'Missing radix parameter in parseInt(). Always specify parseInt(val, 10) to avoid octal parsing bugs.'
    },
    {
        id: 'L203',
        name: 'Await Inside Loop',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /(?:for|while(?:.*?)?\{[^}]*?)\bawait\b/s,
        message: 'Using await inside a loop causes slow, sequential execution. Consider using Promise.all().'
    },
    {
        id: 'L204',
        name: 'Callback Hell / Nested Functions',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /function.*?\{.*function.*?\{.*function/g,
        message: 'Deeply nested functions detected. Refactor using Promises or async/await to prevent callback hell.'
    }
];

/**
 * -------------------------------------------------------------
 * LEVEL 3: ADVANCED (Security & Performance)
 * -------------------------------------------------------------
 */
var LEVEL_3_RULES = [
    {
        id: 'L301',
        name: 'Eval Used',
        severity: 'error',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /\beval\s*\(/,
        message: 'Avoid using eval(). It poses a severe security risk and allows arbitrary code execution.'
    },
    {
        id: 'L302',
        name: 'String in setTimeout',
        severity: 'error',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /\bsetTimeout\s*\(\s*['"`]/,
        message: 'setTimeout() with a string argument evaluates as eval() and poses an extreme security risk.'
    },
    {
        id: 'L303',
        name: 'Hardcoded Secret/Token',
        severity: 'error',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /(api_?key|access_?token|secret|password)['"]?\s*[:=]\s*['"][^'"]+['"]/i,
        message: 'Potential hardcoded secret or API key detected. Never commit secrets, use environment variables (.env).'
    },
    {
        id: 'L304',
        name: 'Loose SQL Injection Risk',
        severity: 'error',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /SELECT\s+.*?\s+FROM\s+.*?\s+WHERE\s+.*?(=|\bLIKE\b)\s*["']?\s*\+\s*[a-zA-Z0-9_.]+/i,
        message: 'Dynamic SQL concatenation detected. This is highly vulnerable to SQL injection. Use parameterized queries.'
    },
    {
        id: 'L305',
        name: 'XSS Risk: innerHTML Assignment',
        severity: 'error',
        extensions: ['js', 'jsx', 'ts', 'tsx', 'html'],
        regex: /\.innerHTML\s*=/,
        message: 'Direct assignment to innerHTML can lead to Cross-Site Scripting (XSS). Use textContent instead.'
    },
    {
        id: 'L306',
        name: 'Unnecessary Delete Operator',
        severity: 'warning',
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        regex: /\bdelete\s+[a-zA-Z_$][0-9a-zA-Z_$]*\.[a-zA-Z_$][0-9a-zA-Z_$]*\b/,
        message: 'The delete operator disables V8 shape optimization (hidden classes). Set properties to null instead.'
    },
    {
        id: 'L307',
        name: 'Global Scope Pollution',
        severity: 'warning',
        extensions: ['js'],
        regex: /^window\.[a-zA-Z_$][0-9a-zA-Z_$]*\s*=/,
        message: 'Assigning to the global window object pollutes global scope and causes collisions.'
    }
];

/**
 * -------------------------------------------------------------
 * LEVEL 4: REACT & JSX LINTING
 * -------------------------------------------------------------
 */
var LEVEL_4_RULES = [
    {
        id: 'L401',
        name: 'Missing Key in Map',
        severity: 'warning',
        extensions: ['jsx', 'tsx'],
        regex: /\.map\s*\(\s*\(?[^)]*(?:=>|\{)[^<]*<\s*[a-zA-Z0-9_]+(?!\s+key=)/,
        message: 'Missing "key" prop in mapped element. React needs keys to optimize re-rendering.'
    },
    {
        id: 'L402',
        name: 'Inline Function in JSX',
        severity: 'info',
        extensions: ['jsx', 'tsx'],
        regex: /<(?:[a-zA-Z0-9_]+)\s+.*?=\s*\{\s*(?:\([^)]*\)|[a-zA-Z_]+)\s*=>/,
        message: 'Inline arrow function in markup. This creates a new function on every render, hurting performance.'
    },
    {
        id: 'L403',
        name: 'Dangerously Set Inner HTML',
        severity: 'error',
        extensions: ['jsx', 'tsx'],
        regex: /dangerouslySetInnerHTML/,
        message: 'Usage of dangerouslySetInnerHTML exposes the app to Cross-Site Scripting (XSS) risks.'
    }
];

/**
 * -------------------------------------------------------------
 * LEVEL 5: HTML / CSS LINTING
 * -------------------------------------------------------------
 */
var LEVEL_5_RULES = [
    {
        id: 'L501',
        name: 'Inline Styles',
        severity: 'warning',
        extensions: ['html', 'htm'],
        regex: /<[a-zA-Z0-9_]+\s+[^>]*\bstyle\s*=\s*['"]/,
        message: 'Inline styles are difficult to maintain and override. Extract to a CSS class.'
    },
    {
        id: 'L502',
        name: 'Missing alt Attribute on Image',
        severity: 'warning',
        extensions: ['html', 'htm', 'jsx', 'tsx'],
        regex: /<img\s+(?![^>]*\balt\s*=)[^>]*>/i,
        message: 'Images must have an alt attribute for accessibility and SEO.'
    },
    {
        id: 'L503',
        name: 'Deprecated HTML Tags',
        severity: 'warning',
        extensions: ['html', 'htm', 'jsx', 'tsx'],
        regex: /<\/?(font|center|marquee|blink)>/i,
        message: 'Usage of deprecated legacy HTML tags detected. Use CSS instead.'
    },
    {
        id: 'L504',
        name: 'CSS !important Usage',
        severity: 'warning',
        extensions: ['css', 'scss', 'less'],
        regex: /!important/,
        message: 'Usage of !important detected. It breaks CSS specificity cascades and creates maintenance nightmares.'
    }
];

// Combine all rules
var ALL_RULES = LEVEL_1_RULES.concat(LEVEL_2_RULES, LEVEL_3_RULES, LEVEL_4_RULES, LEVEL_5_RULES);


function getRulesForExtension(extension) {
    var cleanExt = extension.replace(/^\./, '').toLowerCase();

    // Fallback logic for when extension isn't perfectly mapped
    if (cleanExt === '') {
        return ALL_RULES.filter(function (r) { return r.extensions.indexOf('js') !== -1; });
    }

    var result = [];
    for (var i = 0; i < ALL_RULES.length; i++) {
        var rule = ALL_RULES[i];
        if (rule.extensions.indexOf(cleanExt) !== -1) {
            result.push(rule);
        }
    }

    return result;
}

function getAllRulesCount() {
    return ALL_RULES.length;
}

module.exports = {
    getRulesForExtension: getRulesForExtension,
    getAllRulesCount: getAllRulesCount,
    ALL_RULES: ALL_RULES
};
