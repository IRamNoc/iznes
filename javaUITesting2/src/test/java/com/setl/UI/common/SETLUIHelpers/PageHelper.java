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
}
