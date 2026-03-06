'use strict';

var fs = require('fs');
var path = require('path');
var { getRulesForExtension } = require('./rules.js');

var MAX_FILE_SIZE = 5 * 1024 * 1024;

function scanFile(filePath, options) {
    var opts = options || {};
    var results = {
        filePath: filePath,
        errors: [],
        warnings: [],
        infos: [],
        scanned: false,
        skipped: false,
        error: null
    };

    try {
        var stat = fs.statSync(filePath);
        if (stat.size > MAX_FILE_SIZE) {
            results.skipped = true;
            return results;
        }

        var source = fs.readFileSync(filePath, 'utf-8');
        var lines = source.split('\n');
        var ext = path.extname(filePath).replace('.', '');
        var rules = getRulesForExtension(ext);

        for (var i = 0; i < lines.length; i++)
        {
            var line = lines[i];
            if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
                continue;
            }
            for (var r = 0; r < rules.length; r++) {
                var rule = rules[r];
                var match = line.match(rule.regex);
                if (match) {
                    var issue = {
                        id: rule.id,
                        line: i + 1,
                        column: match.index + 1,
                        message: rule.message,
                        snippet: line.trim().substring(0, 100), // Max 100 chars
                        name: rule.name
                    };
                    if (rule.severity === 'error') {
                        results.errors.push(issue);
                    } else if (rule.severity === 'warning') {
                        results.warnings.push(issue);
                    } else {
                        results.infos.push(issue);
                    }
                }
            }
        }
        results.scanned = true;
    } catch (err) {
        results.error = err.message;
    }

    return results;
}

module.exports = { scanFile: scanFile };
