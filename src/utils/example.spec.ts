import { test, expect } from '@playwright/test';



test('auth', async ({ page }) => {
  await page.goto('https://zenji-1e015.web.app');
  await page.click('text="Sign in with Google"');

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    //page.click('text="Sign in with Google"') // Assuming this triggers the popup
  ]);

  await popup.waitForSelector('input[type="email"]', { state: 'visible' });
  await popup.fill('input[type="email"]', 'zenjiapp@gmail.com');
  await popup.click('text="Next"');


  await popup.waitForSelector('input[type="password"]', { state: 'visible' });
  await popup.fill('input[type="password"]', 'T4aleC4pst0ne');
  await popup.click('text="Next"');


  await page.waitForURL(url => url.href.startsWith('https://zenji-1e015.web.app'));


  await expect(page.getByRole('button', { name: 'Hello, Zenji' })).toBeVisible();
});

test('click deck ', async ({ page }) => {
  await page.goto('https://zenji-1e015.web.app');
  // Assuming the page is already authenticated and navigated to the correct URL
  await page.waitForSelector('deck-card clip-contents', { state: 'visible' });
  // Click on the deck. Replace `deckSelector` with the actual selector for the deck.
  // Example: If the deck has a specific text, you could use `text="Deck Name"`
  // If it's an id, you could use `#deckId`, etc.
  await page.click('JLPT 1');

  await page.waitForSelector('text="JLPT 1"', { state: 'visible' });

});

