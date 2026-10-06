const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';
const SELENIUM_URL = process.env.SELENIUM_URL || 'http://127.0.0.1:4444';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;
const CONDUCTOR_EMAIL = process.env.E2E_CONDUCTOR_EMAIL;
const CONDUCTOR_PASSWORD = process.env.E2E_CONDUCTOR_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !CONDUCTOR_EMAIL || !CONDUCTOR_PASSWORD) {
  console.error('E2E: E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD/E2E_CONDUCTOR_EMAIL/E2E_CONDUCTOR_PASSWORD must be set.');
  process.exit(2);
}

async function createDriver() {
  const options = new chrome.Options();
  options.addArguments('--headless=new','--no-sandbox','--disable-dev-shm-usage','--window-size=1440,1000');
  return new Builder().forBrowser('chrome').setChromeOptions(options).usingServer(SELENIUM_URL).build();
}
async function waitForText(driver,text){await driver.wait(until.elementLocated(By.xpath(`//*[contains(normalize-space(.), ${JSON.stringify(text)})]`)),10000)}
async function run(){
  const driver=await createDriver();
  try{
    await driver.get(`${BASE_URL}/events`); await waitForText(driver,'Find your next event');
    const search=await driver.findElement(By.css('[data-testid="event-search"]')); await search.sendKeys('Nex-Synapse'); await waitForText(driver,'Nex-Synapse 2026');

    const participantEmail=`participant.${Date.now()}@eventflow.test`, participantPassword='EventFlow@123';
    await driver.get(`${BASE_URL}/register`);
    await driver.findElement(By.css('[data-testid="register-name"]')).sendKeys('E2E Participant');
    await driver.findElement(By.css('[data-testid="register-email"]')).sendKeys(participantEmail);
    await driver.findElement(By.css('[data-testid="register-password"]')).sendKeys(participantPassword);
    await driver.findElement(By.css('[data-testid="register-confirm-password"]')).sendKeys(participantPassword);
    await driver.findElement(By.css('[data-testid="register-phone"]')).sendKeys('9876543210');
    await driver.findElement(By.css('[data-testid="register-college"]')).sendKeys('EventFlow Institute');
    await driver.findElement(By.css('[data-testid="register-department"]')).sendKeys('Computer Engineering');
    await driver.findElement(By.css('[data-testid="register-year"]')).sendKeys('3rd Year');
    await driver.findElement(By.css('[data-testid="register-submit"] button')).click();
    await driver.wait(until.urlContains('/login'),5000);
    await driver.findElement(By.css('[data-testid="email"]')).sendKeys(participantEmail);
    await driver.findElement(By.css('[data-testid="password"]')).sendKeys(participantPassword);
    await driver.findElement(By.css('[data-testid="login-submit"] button')).click();
    await driver.wait(until.urlContains('/dashboard'),5000);

    await driver.get(`${BASE_URL}/admin/devops`); await driver.wait(until.urlContains('/unauthorized'),5000);

    await driver.get(`${BASE_URL}/login`);
    await driver.findElement(By.css('[data-testid="event-conductor-role"]')).click();
    await driver.findElement(By.css('[data-testid="email"]')).sendKeys(CONDUCTOR_EMAIL);
    await driver.findElement(By.css('[data-testid="password"]')).sendKeys(CONDUCTOR_PASSWORD);
    await driver.findElement(By.css('[data-testid="login-submit"] button')).click();
    await driver.wait(until.urlContains('/conductor'),5000);
    await driver.get(`${BASE_URL}/admin`); await driver.wait(until.urlContains('/unauthorized'),5000);

    await driver.manage().deleteAllCookies();
    await driver.get(`${BASE_URL}/login`);
    await driver.findElement(By.css('[data-testid="admin-role"]')).click();
    await driver.findElement(By.css('[data-testid="email"]')).sendKeys(ADMIN_EMAIL);
    await driver.findElement(By.css('[data-testid="password"]')).sendKeys(ADMIN_PASSWORD);
    await driver.findElement(By.css('[data-testid="login-submit"] button')).click();
    await driver.wait(until.urlContains('/admin'),5000);
    await driver.get(`${BASE_URL}/admin/devops`); await waitForText(driver,'DevSecOps Pipeline'); await waitForText(driver,'Jenkins'); await waitForText(driver,'Selenium');
    console.log('E2E: PASS');
  } finally { await driver.quit(); }
}
run().catch(e=>{console.error('E2E: FAIL');console.error(e);process.exit(1)});
