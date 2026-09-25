// Capture live screenshot of practice exam session with Edge
import { chromium } from 'playwright';

async function captureExamScreenshots() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true // Fast background capture
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    console.log('Navigating to practice with Figure Sequences...');
    await page.goto('http://127.0.0.1:5173/practice?submodule=Figure%20Sequences', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Click 20 questions
    const btn20 = await page.$('button:has-text("20")');
    if (btn20) await btn20.click();

    // Start practice exam
    await page.click('button:has-text("Start Practice Exam")');
    await page.waitForTimeout(1500);

    // Screenshot Question 1
    console.log('Capturing Question 1 screenshot...');
    await page.screenshot({ path: 'question_1_options_rendered.png', fullPage: true });

    // Click Option 1
    const visualOptions = await page.$$('.visual-option');
    console.log('Found', visualOptions.length, 'options');
    if (visualOptions.length >= 4) {
      await visualOptions[0].click();
      await page.waitForTimeout(800);
      console.log('Capturing feedback screenshot...');
      await page.screenshot({ path: 'question_1_feedback_explanation.png', fullPage: true });
    }

    console.log('✅ Screenshots captured successfully!');
  } catch (err) {
    console.error('Error capturing screenshot:', err);
  } finally {
    await browser.close();
  }
}

captureExamScreenshots();
