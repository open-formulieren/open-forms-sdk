'use strict';

const fs = require('fs');

const paths = require('../config/paths');

const packageJson = JSON.parse(fs.readFileSync(paths.appPackageJson, 'utf-8'));

// make package.json modifications to be able to publish the package. Workspaces require
// private=true, but to publish it, it must be private=false. While publishing the
// package, we do not use workspaces.
packageJson.private = false;

const stringified = JSON.stringify(packageJson, null, 2) + "\n";
fs.writeFileSync(paths.appPackageJson, stringified);
