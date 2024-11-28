const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");

puppeteer.use(StealthPlugin());
// badel l username mt3k
const username = "Username";
const password = "Changeme@123";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    args: ["--start-maximized"],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  try {
    let updatePasswordPageReached = false;
    let retryCount = 0;

    while (!updatePasswordPageReached) {
      retryCount++;
      console.log(`Attempt #${retryCount}: Navigating to the login page...`);
      await page.goto("https://grade.esprit.tn", { waitUntil: "networkidle2" });

      console.log("Filling in login details...");
      await page.type("#username", username, { delay: 100 });
      await page.type("#password", password, { delay: 100 });

      console.log("Clicking the login button...");
      await page.click("#loginbtn");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Clicking the 'Continue' button on the next page...");
      await page.click("#id_submitbutton");
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      console.log("Checking if we are on the 'Update Password' page...");
      const pageContent = await page.content();

      if (
        pageContent.includes("Update Password") ||
        page.url().includes("change_password.php")
      ) {
        console.log("The 'Update Password' page is reached!");
        updatePasswordPageReached = true;
      } else {
        console.log(`Attempt #${retryCount} failed. Retrying login...`);
      }
    }

    console.log(
      `Success after ${retryCount} attempts! You are now on the 'Update Password' page. The browser will remain open for manual interaction.`
    );

    await new Promise(() => {});
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
