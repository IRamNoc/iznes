// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const filterRegExp = new RegExp('/setl|ofi|setl_modules/', 'g');
const context = require.context('../', true, /\.spec\.ts$/);
const setlFiles = context.keys().filter(path => new RegExp('@setl', 'g').test(path));
const ofiFiles = context.keys().filter(path => new RegExp('@setl', 'g').test(path));
const setlModuleFiles = context.keys().filter(path => new RegExp('setl_modules', 'g').test(path));
const specFiles = setlFiles.concat(ofiFiles.concat(setlModuleFiles));
console.log(specFiles);
// and load the modules.
specFiles.map(context);
// Finally, start Karma to run the tests.
__karma__.start();

