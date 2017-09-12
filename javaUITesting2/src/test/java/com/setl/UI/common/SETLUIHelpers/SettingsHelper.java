package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static com.setl.UI.common.SETLUIHelpers.SetUp.verificationErrors;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


public class SettingsHelper extends LoginAndNavigationHelper {


    public static void navigateToSettings() throws InterruptedException {
        assertTrue(isElementPresent(By.cssSelector("i.fa.fa-tasks")));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try{
            WebElement settings = driver.findElement(By.cssSelector("i.fa.fa-tasks"));
            wait.until(visibilityOf(settings));
            wait.until(elementToBeClickable(settings));
            settings.click();
        }catch (Exception e){
            System.out.println("Settings not ready");
        }
        for (int second = 0;; second++) {
            if (second >= 3) fail("timeout");
            try { if (isElementPresent(By.xpath("//div[@id='right-sidebar']/div/div/ul/li[2]/a"))) break; } catch (Exception e) {}
            Thread.sleep(200);
        }
        try {
            WebElement gear = driver.findElement(By.cssSelector("i.fa.fa-gear"));
            wait.until(visibilityOf(gear));
            wait.until(elementToBeClickable(gear));
            gear.click();
        }catch (Exception e) {
            System.out.println("gear was not found");
        }
    }

    public static void selectDisplayDashboards() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.xpath("//div[@id='tab-3-right']/div[2]/div/div/label/span[2]")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement dashboard = driver.findElement(By.xpath("//div[@id='tab-3-right']/div[2]/div/div/label/span[2]"));
            wait.until(visibilityOf(dashboard));
            wait.until(elementToBeClickable(dashboard));
            dashboard.click();
        }catch (Exception e){
            System.out.println("Dashboard not ready");
        }

    }

    public static void selectDisplayLegalEntities() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.xpath("//div[@id='tab-3-right']/div[3]/div/div/label/span[2]")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement lei = driver.findElement(By.xpath("//div[@id='tab-3-right']/div[3]/div/div/label/span[2]"));
            wait.until(visibilityOf(lei));
            wait.until(elementToBeClickable(lei));
            lei.click();
        }catch (Exception e){
            System.out.println("LEI not ready");
        }

    }

    public static void selectDisplayDirectory() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.xpath("//div[@id='tab-3-right']/div[4]/div/div/label/span[2]")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement directory = driver.findElement(By.xpath("//div[@id='tab-3-right']/div[4]/div/div/label/span[2]"));
            wait.until(visibilityOf(directory));
            wait.until(elementToBeClickable(directory));
            directory.click();
        }catch (Exception e){
            System.out.println("Directory not ready");
        }

    }

    private static boolean isElementPresent(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
}
