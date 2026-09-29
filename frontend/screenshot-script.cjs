const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/about');
  await page.waitForLoadState('networkidle');
  const section = await page.$('.leader-grid');
  await section.screenshot({ path: 'screenshot-leaders.png', animations: 'disabled' });
  await browser.close();
  console.log('done');
})();
