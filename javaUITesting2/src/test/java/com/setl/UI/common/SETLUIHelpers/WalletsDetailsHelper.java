package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.setl.UI.common.SETLUIHelpers.PageHelper.selectNewPageToNavigateTo;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


public class WalletsDetailsHelper extends LoginAndNavigationHelper {

    public static void selectLEIFromLEISearch(String LEI) {
        WebElement search = driver.findElement(By.id("lei-search-input"));
        search.clear();
        search.sendKeys(LEI);
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement leiButton = driver.findElement(By.xpath("//table[@id='legalentities-table']/tbody/tr/td/div/button"));
            wait.until(visibilityOf(leiButton));
            wait.until(elementToBeClickable(leiButton));
            leiButton.click();
        } catch (NoSuchElementException n) {
            System.out.println("Element not present " + n.getMessage());
        } catch (ElementNotVisibleException v) {
            System.out.println("Element not clickable " + v.getMessage());
        } catch (ElementNotSelectableException s) {
            System.out.println("Element not clickable " + s.getMessage());
        } catch (TimeoutException t) {
            System.out.println("Element not ready " + t.getMessage());
        }
    }
}
