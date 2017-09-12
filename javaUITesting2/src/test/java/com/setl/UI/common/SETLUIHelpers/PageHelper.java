package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


public class PageHelper extends LoginAndNavigationHelper {

    public static boolean verifyCorrectPageIsDisplayed(String pageElement) throws InterruptedException {

        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement page = driver.findElement(By.cssSelector(pageElement));
            wait.until(visibilityOf(page));
            wait.until(elementToBeClickable(page));


        boolean isDisplayed = page.isDisplayed();
        if (!isDisplayed) fail("Incorrect Page Displayed");
        }catch (Exception e){
            return false;
        }
        return true;
    }

    public static boolean verifyPageIsNotDisplayed(String pageElement) throws InterruptedException {
        Thread.sleep(1000);
        WebElement page = driver.findElement(By.cssSelector(pageElement));
        boolean isDisplayed = page.isDisplayed();
        if (isDisplayed) fail(pageElement + " page has been displayed and should not have been");
        return false;
    }

    public static void verifyLoginPageIsDisplayed() throws InterruptedException {
        try {
            assertTrue("Login page not displayed", isElementPresent(By.id("userpassinput")));
        }catch (Exception e){
            System.out.println("login page was not displayed");
        }
    }

    public static void selectNewPageToNavigateToOld(String newPageId) throws InterruptedException {
        for (int second = 0; ; second++) {
            if (second >= 5) fail("Link to " + newPageId + " is not ready");
            try {
                if (isElementPresent(By.id(newPageId))) break;
            } catch (Exception e) {
                System.out.println("Link to  " + newPageId + " is not ready " + e);
            }
            Thread.sleep(500);
        }
        driver.findElement(By.id(newPageId)).click();
    }

    public static void selectNewPageToNavigateTo(String newPageId) throws InterruptedException {
        try{
            WebElement newPageLink = driver.findElement(By.id(newPageId));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(newPageLink));
            wait.until(elementToBeClickable(newPageLink));
            newPageLink.click();

        }catch (Exception e){
            System.out.println(newPageId + " was not available " + e.getMessage());
        }
    }

    public static void waitForLinkText(String text, WebElement link) {
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(link));
            wait.until(elementToBeClickable(link));
        } catch (Exception e)
        {
            System.out.println(text +  " was not available " + e);
        }
    }

    public static boolean SelectItemOnNavigationAndVerify(String navigationID, String pageElement){
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement navigationItem = driver.findElement(By.id(navigationID));
            wait.until(visibilityOf(navigationItem));
            wait.until(elementToBeClickable(navigationItem));
            navigationItem.click();
        }catch(Exception e){
            System.out.println("Navigation item was not present " + e.getMessage());
        }
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement page = driver.findElement(By.cssSelector(pageElement));
            wait.until(elementToBeClickable(page));
            boolean isDisplayed = page.isDisplayed();
            if (!isDisplayed) fail("Incorrect Page Displayed");
        }catch (Exception e){
            return false;
        }
        return true;
    }

    public static boolean SelectItemOnNavigationAndVerifyNotPresent(String navigationID, String pageElement){
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement navigationItem = driver.findElement(By.id(navigationID));
            wait.until(visibilityOf(navigationItem));
            wait.until(elementToBeClickable(navigationItem));
            navigationItem.click();
            Thread.sleep(1000);
        }catch(Exception e){
            System.out.println("Navigation item was not present " + e.getMessage());
        }
        WebElement page = driver.findElement(By.cssSelector(pageElement));
        boolean isDisplayed = page.isDisplayed();
        if (isDisplayed) fail(pageElement + " page has been displayed and should not have been");
        return false;
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
