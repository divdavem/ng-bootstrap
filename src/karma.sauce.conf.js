// Configuration used testing via Sauce Labs on Travis CI

process.env.SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY.split('').reverse().join('');

const BROWSERS = {
  'CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest'
  },
  'FIREFOX': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest'
  },
  'EDGE': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: 'latest'
  },
  'EDGE18': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '18.17763'
  },
  'IE11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11'
  },
  'SAFARI12': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.14',
    version: '12'
  },
  'SAFARI13': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.15',
    version: '13'
  },
};

module.exports = function (config) {
  config.set({
    basePath: '',
    files: ['../node_modules/bootstrap/dist/css/bootstrap.min.css', '../src/test/test-styles.css'],
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-sauce-launcher'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    sauceLabs: {
      build: `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      testName: 'ng-bootstrap',
      retryLimit: 3,
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        commandTimeout: 600,
        idleTimeout: 600,
        maxDuration: 5400
      }
    },

    customLaunchers: BROWSERS,

    reporters: ['dots', 'saucelabs'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['CHROME', 'FIREFOX', 'EDGE', 'EDGE18', 'SAFARI12', 'SAFARI13'],
    autoWatch: false,
    singleRun: true,
    // Saucelabs has a concurrency limit of 5 browser sessions for open source projects:
    // https://saucelabs.com/solutions/open-source
    // If the number of concurrent browsers is reached, requests are put on a queue.
    // According to the following link, a request can stay in the queue for 10min:
    // https://support.saucelabs.com/hc/en-us/articles/360002048214-Queuing-Tests-on-Sauce-Labs
    // The capture timeout should match that time plus some time to start the browser session
    // (evaluated to 1min30s here), so a total of 11min30s = 690000ms.
    captureTimeout: 690000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000
  });
};
