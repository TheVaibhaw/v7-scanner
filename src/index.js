'use strict';

var { scanFile } = require('./scanner.js');
var { walkDirectory, getExtension } = require('./walker.js');
var { ALL_RULES, getRulesForExtension } = require('./rules.js');
var version = require('../package.json').version;

function scan(pathStr) {
    return scanFile(pathStr);
}

function scanDirectory(dirPath) {
    var files = walkDirectory(dirPath);
    var results = [];
    var totalErrors = 0;
    var totalWarnings = 0;

    for (var i = 0; i < files.length; i++) {
        var res = scanFile(files[i]);
        if (!res.skipped && (res.errors.length > 0 || res.warnings.length > 0)) {
            results.push(res);
            totalErrors += res.errors.length;
            totalWarnings += res.warnings.length;
        }
    }

    return {
        totalFilesScanned: files.length,
        totalErrors: totalErrors,
        totalWarnings: totalWarnings,
        results: results
    };
}

module.exports = {
    scan: scan,
    scanDirectory: scanDirectory,
    ALL_RULES: ALL_RULES,
    getRulesForExtension: getRulesForExtension,
    version: version
};
