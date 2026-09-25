import { chromium } from 'playwright';
import path from 'path';

async function verifyLatinUI() {
  console.log('Starting Playwright test for Latin Squares UI...');
  const artifactDir = 'C:/Users/User/.gemini/antigravity-ide/brain/8b805acb-8957-478e-b722-4cfafe81da12';

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://127.0.0.1:5173/practice ...');
    await page.goto('http://127.0.0.1:5173/practice', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Find all submodule toggle divs
    const submoduleItems = await page.$$('div:has-text("Figure Sequences"), div:has-text("Mathematical Equations"), div:has-text("Vector Calculations"), div:has-text("Hydrostatics"), div:has-text("Optimal Order Quantity"), div:has-text("Research Strategies")');

    // Or simply click on each checkbox that is NOT Latin Squares
    const checkBoxes = await page.$$('input[type="checkbox"]');
    for (const cb of checkBoxes) {
      const parent = await cb.evaluate(el => el.closest('div')?.innerText || '');
      if (parent && !parent.includes('Latin Squares') && (parent.includes('Figure') || parent.includes('Equations') || parent.includes('Vector') || parent.includes('Hydro') || parent.includes('Order') || parent.includes('Research'))) {
        const isChecked = await cb.isChecked();
        if (isChecked) {
          await cb.click();
          await page.waitForTimeout(100);
        }
      }
    }

    // Click on button '5' for question count
    const btn5 = await page.$('button:has-text("5")');
    if (btn5) {
      await btn5.click();
      await page.waitForTimeout(200);
    }

    // Click "Start Practice Session"
    const startBtn = await page.$('button:has-text("Start Practice")');
    if (startBtn) {
      console.log('Clicking Start Practice Session...');
      await startBtn.click();
      await page.waitForURL(url => url.pathname.includes('/exam-session/'), { timeout: 10000 });
      await page.waitForTimeout(1000);
    }

    // Take screenshot of question
    const qShotPath = path.join(artifactDir, 'latin_square_unambiguous_question.png');
    await page.screenshot({ path: qShotPath, fullPage: true });
    console.log('Saved question screenshot:', qShotPath);

    // Select an option item
    const options = await page.$$('.option-item');
    if (options.length > 0) {
      console.log(`Found ${options.length} options. Clicking option 0...`);
      await options[0].click();
      await page.waitForTimeout(600);
    }

    // If immediate feedback is not auto-shown, click check answer or submit
    const checkBtn = await page.$('button:has-text("Check Answer"), button:has-text("Submit")');
    if (checkBtn) {
      await checkBtn.click();
      await page.waitForTimeout(600);
    }

    // Scroll down to explanation
    const expPanel = await page.$('.explanation-panel');
    if (expPanel) {
      await expPanel.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }

    // Take screenshot of explanation
    const expShotPath = path.join(artifactDir, 'latin_square_solution_explanation.png');
    await page.screenshot({ path: expShotPath, fullPage: true });
    console.log('Saved explanation screenshot:', expShotPath);

  } catch (err) {
    console.error('Error during Latin UI verification:', err);
  } finally {
    await browser.close();
    console.log('Verification finished.');
  }
}

verifyLatinUI();
