#!/usr/bin/env node
'use strict';

import fs from 'fs';
import path from 'path';

const APP_DIRECTORY = fs.realpathSync(process.cwd());
const PACKAGE_JSON_PATH = path.resolve(APP_DIRECTORY, 'package.json');

const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));

// make package.json modifications to be able to publish the package. Workspaces require
// private=true, but to publish it, it must be private=false. While publishing the
// package, we do not use workspaces.
packageJson.private = false;

const stringified = JSON.stringify(packageJson, null, 2) + '\n';
fs.writeFileSync(PACKAGE_JSON_PATH, stringified);
