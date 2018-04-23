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

    public static void verifyCorrectPage(String title) {
        assertTrue(driver.findElement(By.className("header-breadcrumbs")).getText().equals(title));
    }

    public static void verifyCorrectPageById(String title) {
        assertTrue(driver.findElement(By.id("pageTitle")).getText().equals(title));

    }

    public static void waitForNewFundShareTitle() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
            wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-0\"]/h3")));
            String shareTitle = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/h3")).getText();

            assertTrue(shareTitle.equals("Please enter following information to create a new Fund Share"));
        }catch (Error e){
            fail(e.getMessage());
        }
    }

    public static void waitForNewShareButton() {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        try {
            wait.until(visibilityOfElementLocated((By.id("new-share-btn"))));
            wait.until(elementToBeClickable(By.id("new-share-btn")));
            WebElement newShare = driver.findElement(By.id("new-share-btn"));
            newShare.click();
        }catch (Error e){
            fail(e.getMessage());
        }
    }
}
