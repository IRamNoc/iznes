package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

public class CaptureNewAddress {


    public CaptureNewAddress() throws InterruptedException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement addressCreated = driver.findElement(By.xpath("//body/div[21]"));
            wait.until(visibilityOf(addressCreated));
            } catch (Exception e) {
                System.out.println("Address not created " + e);
            }
        }

    public static String getAddress() {
        String address = null;
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOfElementLocated(By.cssSelector(SweetAlert)));
            address = driver.findElement(By.cssSelector(SweetAlert)).getText();
        } catch (Exception e) {
            System.out.println("Address is not present");
        }
        return String.valueOf(address.substring(10));
    }
}