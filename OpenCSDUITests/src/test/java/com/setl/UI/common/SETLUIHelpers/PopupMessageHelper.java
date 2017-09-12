package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;

public class PopupMessageHelper extends LoginAndNavigationHelper {

    public static void verifyPopupMessageText(String alertText, String failText) throws InterruptedException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOfElementLocated(By.cssSelector(SweetAlert)));
            wait.until(elementToBeClickable(driver.findElement(By.cssSelector("button.confirm"))));
            }catch (TimeoutException t) {
                System.out.println(failText + "Timed Out  " + t.getMessage());
            }catch (NoSuchElementException n) {
                System.out.println(failText + "Popup not present  " + n.getMessage());
            }catch (ElementNotVisibleException v) {
                System.out.println(failText + "Popup not visible  " + v.getMessage());
            }catch (ElementNotSelectableException s) {
                System.out.println(failText + "Confirm button not ready  " + s.getMessage());
            }
            try {
                WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
                wait.until(visibilityOfElementLocated(By.cssSelector(SweetAlertHeader)));
                if (!(driver.findElement(By.cssSelector(SweetAlert)).getText().contains(alertText))) {
                    fail("Actual message was : " + (driver.findElement(By.cssSelector(SweetAlert)).getText() + " " + (driver.findElement(By.cssSelector((SweetAlertHeader))).getText())));
                }
            }catch (Exception e)
            {
                System.out.println("No Text present " + e.getMessage());
            }
            closePopup();
    }

    public static void verifyChainNotSelectedPopUp() throws InterruptedException {

        for (int second = 0; ; second++) {
            //do not fail on non appearance - just return
            if (second >= 10) return;
            try {
                if (driver.findElement(By.cssSelector(SweetAlert)).getText().equalsIgnoreCase("Please Select a Chain First"))
                    break;
            } catch (Exception e) {
                System.out.println();
            }
            Thread.sleep(100);
        }
        driver.findElement(By.cssSelector("button.confirm")).click();
    }

    public static void verifyPermissionDeniedPopUp() throws InterruptedException {

        for (int second = 0; ; second++) {
            //do not fail on non appearance - just return
            if (second >= 10) return;
            try {
                if (driver.findElement(By.cssSelector(SweetAlert)).getText().equalsIgnoreCase("Permission Denied."))
                    break;
            } catch (Exception e) {
                System.out.println();
            }
            Thread.sleep(100);
        }
        driver.findElement(By.cssSelector("button.confirm")).click();
    }

    public static void verifyWalletNotSelectedPopUp() throws InterruptedException {

        for (int second = 0; ; second++) {
        //do not fail on non appearance - just return
            if (second >= 10) return;
            try {
                if (driver.findElement(By.cssSelector(SweetAlert)).getText().contains("Select a Wallet"))
                    break;
            } catch (Exception e) {
                System.out.println();
            }
            Thread.sleep(100);
        }
        driver.findElement(By.cssSelector("button.confirm")).click();
    }

    public static void verifyDeletionPopUp() throws InterruptedException {

        for (int second = 0; ; second++) {
        //do not fail on non appearance - just return
            if (second >= 10) return;
            try {
                if (driver.findElement(By.cssSelector(SweetAlert)).getText().contains("You will not be able to recover this entry! Deleting this entry may cause deletion of other related entries"))
                    break;
            } catch (Exception e) {
                System.out.println();
            }
            Thread.sleep(100);
        }
    }

    public static void closePopup() throws InterruptedException {
        try {
            WebElement popup = driver.findElement(By.cssSelector("button.confirm"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(popup));
            popup.click();
            } catch (Exception e) {
                System.out.println("Popup was not displayed " + e);
            }
    }

    public static void closePopup(String choice) throws InterruptedException {
        try {
            WebElement popup = driver.findElement(By.cssSelector("button." + choice + ""));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(popup));
            popup.click();
            } catch (Exception e) {
                System.out.println(choice + " button was not displayed " + e);
            }
    }
}
