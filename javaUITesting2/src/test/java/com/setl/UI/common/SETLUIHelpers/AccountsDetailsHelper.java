package com.setl.UI.common.SETLUIHelpers;

import junit.framework.Assert;
import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

public class AccountsDetailsHelper extends com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper {

    public static void myAccountSendKeys(String field, String text) {
        driver.findElement(By.id("ud" + field)).sendKeys(text);
    }

    public static void myAccountClearField(String field) {
        driver.findElement(By.id("ud" + field)).clear();
    }

    public static void scrollElementIntoViewByCss(String css) {
        WebElement element = driver.findElement(By.cssSelector(css));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
    }
}
