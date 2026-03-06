'use strict';

var fs = require('fs');
var path = require('path');
var { walkDirectory } = require('./walker.js');
var { scanFile } = require('./scanner.js');

var version = require('../package.json').version;

var COLORS = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgYellow: '\x1b[43m',
};

function run(args) {
    var startTime = Date.now();

    if (args.length === 0 || args.indexOf('--help') !== -1 || args.indexOf('-h') !== -1) {
        printHelp();
        process.exit(0);
    }

    if (args.indexOf('--version') !== -1 || args.indexOf('-v') !== -1) {
        console.log('v7-scanner v' + version);
        process.exit(0);
    }

    var targets = args.filter(function (arg) { return !arg.startsWith('-'); });

    if (targets.length === 0) {
        console.error(COLORS.red + 'Error: No files or directories specified.' + COLORS.reset);
        console.error('Run ' + COLORS.cyan + 'v7-scanner --help' + COLORS.reset + ' for usage.');
        process.exit(1);
    }

    printBanner();

    var totalFiles = 0;
    var scannedFiles = 0;
    var totalErrors = 0;
    var totalWarnings = 0;
    var totalInfos = 0;
    var skippedFiles = 0;

    for (var t = 0; t < targets.length; t++) {
        var target = targets[t];
        var absTarget = path.resolve(target);

        if (!fs.existsSync(absTarget)) {
            console.error(COLORS.red + '  ✗ Not found: ' + target + COLORS.reset);
            continue;
        }

        var stat = fs.statSync(absTarget);
        var filesToScan = [];

        if (stat.isDirectory()) {
            filesToScan = walkDirectory(absTarget);
        } else {
            filesToScan.push(absTarget);
        }

        totalFiles += filesToScan.length;

        for (var f = 0; f < filesToScan.length; f++) {
            var file = filesToScan[f];
            var result = scanFile(file);

            if (result.skipped) {
                skippedFiles++;
                continue;
            }

            scannedFiles++;

            var hasIssues = result.errors.length > 0 || result.warnings.length > 0 || (result.infos && result.infos.length > 0);

            if (hasIssues) {
                var relPath = path.relative(process.cwd(), file);
                var displayPath = relPath.startsWith('.') ? relPath : './' + relPath;

                console.log('\n' + COLORS.bold + displayPath + COLORS.reset);

                for (var e = 0; e < result.errors.length; e++) {
                    var err = result.errors[e];
                    totalErrors++;
                    console.log('  ' + COLORS.red + '✖' + COLORS.reset + ' ' +
                        COLORS.dim + err.line + ':' + err.column + COLORS.reset + '  ' +
                        COLORS.red + 'error' + COLORS.reset + '  ' +
                        err.message + '  ' + COLORS.dim + err.id + COLORS.reset);
                    console.log('      ' + COLORS.dim + err.snippet.trim() + COLORS.reset);
                }

                for (var w = 0; w < result.warnings.length; w++) {
                    var warn = result.warnings[w];
                    totalWarnings++;
                    console.log('  ' + COLORS.yellow + '⚠' + COLORS.reset + ' ' +
                        COLORS.dim + warn.line + ':' + warn.column + COLORS.reset + '  ' +
                        COLORS.yellow + 'warning' + COLORS.reset + '  ' +
                        warn.message + '  ' + COLORS.dim + warn.id + COLORS.reset);
                }

                if (result.infos) {
                    for (var i = 0; i < result.infos.length; i++) {
                        var info = result.infos[i];
                        totalInfos++;
                        console.log('  ' + COLORS.blue + 'ℹ' + COLORS.reset + ' ' +
                            COLORS.dim + info.line + ':' + info.column + COLORS.reset + '  ' +
                            COLORS.blue + 'info' + COLORS.reset + '     ' +
                            info.message + '  ' + COLORS.dim + info.id + COLORS.reset);
                    }
                }
            }
        }
    }

    var elapsed = Date.now() - startTime;

    console.log('\n' + COLORS.bold + COLORS.cyan + '  ─── Summary ───' + COLORS.reset);
    console.log(COLORS.white + '  Files scanned:  ' + scannedFiles + ' / ' + totalFiles + COLORS.reset);

    if (totalErrors === 0 && totalWarnings === 0 && totalInfos === 0) {
        console.log(COLORS.green + '  ✓ No issues found! Code looks pure.' + COLORS.reset);
    } else {
        if (totalErrors > 0) {
            console.log(COLORS.red + '  ✖ Errors (Critical): ' + totalErrors + COLORS.reset);
        }
        if (totalWarnings > 0) {
            console.log(COLORS.yellow + '  ⚠ Warnings (Bugs):   ' + totalWarnings + COLORS.reset);
        }
        if (totalInfos > 0) {
            console.log(COLORS.blue + '  ℹ Infos (Hints):     ' + totalInfos + COLORS.reset);
        }
    }

    if (skippedFiles > 0) {
        console.log(COLORS.dim + '  Skipped (too large): ' + skippedFiles + COLORS.reset);
    }

    console.log(COLORS.dim + '  Time:                ' + elapsed + 'ms' + COLORS.reset);
    console.log('');

    if (totalErrors > 0) {
        console.log(COLORS.red + '  Scan failed due to critical security errors.' + COLORS.reset);
        process.exit(1);
    }

    process.exit(0);
}

function printBanner() {
    console.log('');
    console.log(COLORS.bold + COLORS.blue + '  🛡️  V7 Scanner v' + version.padEnd(10) + COLORS.reset);
    console.log(COLORS.dim + '  Lightning-Fast Security & Code Quality Scanner' + COLORS.reset);
    console.log('');
}

function printHelp() {
    printBanner();
    console.log(COLORS.bold + 'USAGE' + COLORS.reset);
    console.log('  v7-scanner <files/directories...>');
    console.log('');
    console.log(COLORS.bold + 'EXAMPLES' + COLORS.reset);
    console.log('  ' + COLORS.cyan + 'v7-scanner .' + COLORS.reset + '                  Scan current directory');
    console.log('  ' + COLORS.cyan + 'v7-scanner src/ app.js' + COLORS.reset + '        Scan specific targets');
    console.log('');
    console.log(COLORS.bold + 'OPTIONS' + COLORS.reset);
    console.log('  ' + COLORS.green + '-h, --help' + COLORS.reset + '              Show this help message');
    console.log('  ' + COLORS.green + '-v, --version' + COLORS.reset + '           Show version number');
    console.log('');
}

module.exports = { run: run };
