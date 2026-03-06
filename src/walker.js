'use strict';

var fs = require('fs');
var path = require('path');

var DEFAULT_IGNORE = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.next',
    '.nuxt',
    '.cache',
    'vendor',
    'package-lock.json',
    'yarn.lock',
];

function walkDirectory(dir, options) {
    var opts = options || {};
    var ignoreList = opts.ignore || DEFAULT_IGNORE;
    var extensions = opts.extensions || ['js', 'jsx', 'ts', 'tsx', 'html', 'htm'];

    var results = [];

    try {
        var files = fs.readdirSync(dir);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            if (ignoreList.some(function (ignore) { return file === ignore || file.startsWith(ignore.replace(/\/$/, '')); })) {
                continue;
            }

            var fullPath = path.join(dir, file);
            var stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                results = results.concat(walkDirectory(fullPath, opts));
            } else if (stat.isFile()) {
                var ext = getExtension(file);
                if (extensions.indexOf(ext) !== -1 || extensions.indexOf(ext.toLowerCase()) !== -1) {
                    results.push(fullPath);
                }
            }
        }
    } catch (err) {
        if (opts.debug) {
            console.warn('v7-scanner: Error reading directory ' + dir, err);
        }
    }

    return results;
}

function getExtension(filename) {
    var match = filename.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1] : '';
}

module.exports = {
    walkDirectory: walkDirectory,
    getExtension: getExtension,
    DEFAULT_IGNORE: DEFAULT_IGNORE
};
