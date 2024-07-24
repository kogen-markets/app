const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console Error:', msg.text());
    }
  });

  // Navigate to the page
  await page.goto('http://localhost:5173', {waitUntil: 'networkidle0'});

  // Check for visible error messages
  const errorMessage = await page.evaluate(() => {
    const errorElement = document.body.innerText;
    if (errorElement && errorElement.includes("Sorry, an unexpected error has occurred")) {
      return errorElement;
    }
    return null;
  });

  if (errorMessage) {
    console.log('Visible Error Message:', errorMessage);
  }

  await browser.close();
})();