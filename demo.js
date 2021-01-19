const { chromium } = require('playwright');
const TestSession = require('./testSession')
const ConsoleTracker = require('./trackers/consoleTracker');
const ClickTracker = require('./trackers/clickTracker');
const ScreenshotTracker = require('./trackers/screenshotTracker');
const args = process.argv.slice(2);


(async () => {
const sessionTitle=args[0]|| `session-${new Date().toISOString()}`;

const browser = await chromium.launch({ headless: false, slowMo: 50 });

const testSession= new TestSession({sessionTitle});

testSession.track(new ConsoleTracker());
testSession.track(new ClickTracker());
testSession.track(new ScreenshotTracker());

const initialUrl=`https://www.google.com`;
await testSession.start(browser,initialUrl);
})();