import React from 'react';
import puppeteer from 'puppeteer';

describe('show/hide an event details', () => {
  let browser;
  let page;
  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250, // slow down by 250ms
      ignoreDefaultArgs: ['--disable-extensions'] // ignores default setting that causes timeout errors
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.event');
  });

  afterAll(() => {
    browser.close();
  });

  test('An event element is collapsed by default', async () => {
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see its details', async () => {
    await page.click('.event .details-button');
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeDefined();
  });

  test('User can collapse an event to hide its details', async () => {
    await page.click('.event .details-button');
    const eventDetails = await page.$('.event .event-details');
    // The toBeNull() matcher is used to ensure the extra details element no longer exists.
    expect(eventDetails).toBeNull();
  });
});

// =================================

describe('Specify number of events.', () => {
  let browser;
  let page;
  jest.setTimeout(30000);
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250, // slow down by 250ms
      ignoreDefaultArgs: ['--disable-extensions'], // ignores default setting that causes timeout errors
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.event');
  });

  afterAll(() => {
    browser.close();
  });

  test('When user hasnt specified a number, 32 is the default number', async () => {
    const countEvents = await page.$('.num');
    expect(countEvents).toBe(32);
  });

  test('User can change the number of events they want to see', async () => {
    const changeCountEvents = await page.$('.num');
    await page.click('.num');
    hangeCountEvents.find('input.num').simulate('change', { target: { value: 24 } });
    expect(changeCountEvents).toBe(24);
  });


});