package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.lang3.RandomStringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.selectNewPageToNavigateTo;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForLinkText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOf;


public class UserDetailsHelper extends LoginAndNavigationHelper {

    public static void populateUserDetailFields(String username, String email,
                                                     String accountIndex, String userTypeIndex,
                                                     String password, String repeatPassword, String[] adminGroups) throws InterruptedException {
        enterUsername(username);
        enterEmailAddress(email);
        selectAccount(accountIndex);
        selectUserType(userTypeIndex);
        enterPasswordAndVerificationPassword(password, repeatPassword);
        selectAdministrativeGroup(adminGroups);
        submitUserDetails();
    }

   public static void populateUserDetailFields(String username, String email,
                                                     String accountIndex, String userTypeIndex,
                                                     String password, String repeatPassword) throws InterruptedException {
        enterUsername(username);
        enterEmailAddress(email);
        selectAccount(accountIndex);
        selectUserType(userTypeIndex);
        enterPasswordAndVerificationPassword(password, repeatPassword);
        selectAdministrativeGroup(StandardUserGroup);
        submitUserDetails();
   }

    private static void enterUsername(String username) {
        driver.findElement(By.cssSelector("input.form-control.username")).clear();
        driver.findElement(By.cssSelector("input.form-control.username")).sendKeys(username);
    }

    public static void enterEmailAddress(String email) {
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[2]/div/input")).clear();
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[2]/div/input")).sendKeys(email);
    }

    private static void selectAccount(String accountIndex) throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.linkText("Select an Option")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }

        driver.findElement(By.linkText("Select an Option")).click();
        driver.findElement(By.xpath("//div[@id='user-tab-2']" +
                "/div/form/div/div[3]/div/div/div/ul/li[" + accountIndex + "]")).click();
    }

    private static void selectUserType(String userTypeIndex) throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.linkText("choose type...")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        driver.findElement(By.linkText("choose type...")).click();
        driver.findElement(By.xpath("//div[@id='user-tab-2']" +
                "/div/form/div/div[4]/div/div/div/ul/li[" + userTypeIndex + "]")).click();
    }

    private static void enterPasswordAndVerificationPassword(String password, String repeatPassword) {
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[5]/div/input"));
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[5]/div/input")).sendKeys(password);
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[6]/div/input"));
        driver.findElement(By.xpath(".//*[@id='user-tab-2']/div/form/div/div[6]/div/input")).sendKeys(repeatPassword);
    }

    private static void selectAdministrativeGroup(String... groups)
    {
        try {
            assertTrue(isElementPresent(By.xpath("//div[@id='user-tab-2']/div/form/div/div[7]/div/div/ul/li/a/span")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        try {
            assertTrue(isElementPresent(By.xpath("//div[@id='user-tab-2-1']/div/div/ul/li/a/span")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        ((JavascriptExecutor) driver).executeScript("$('#user-tab-2-1-1 .chosen-select.adminGroup').val("+ Arrays.stream(groups).map(s->"'"+s+"'").collect(Collectors.joining(",","[","]"))+").trigger('chosen:updated').trigger('change')");
    }

    private static void submitUserDetails()
    {
        driver.findElement(By.xpath("(//button[@type='submit'])[10]")).click();
    }

    public static String[] generateRandomUserDetails() {
        String str = RandomStringUtils.randomAlphabetic(10);
        String userName = "Test_User_" + str;
        String emailAddress = userName + "@" + str + ".com";
        return new String[] {userName, emailAddress};
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
